"""
🔬 Quantum-Enhanced Schedule Optimization System
Advanced quantum computing algorithms for optimal course scheduling

This module implements quantum annealing and variational quantum eigensolvers
for solving complex scheduling optimization problems that are NP-hard in classical computing.

Author: RIZAL
Version: 2.1.0
License: MIT
"""

import numpy as np
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
from qiskit.algorithms import VQE, QAOA
from qiskit.algorithms.optimizers import COBYLA, SPSA, SLSQP
from qiskit.circuit.library import TwoLocal, EfficientSU2
from qiskit.opflow import PauliSumOp, StateFn, CircuitStateFn
from qiskit.providers.aer import AerSimulator
from qiskit.utils import QuantumInstance
from qiskit.ignis.mitigation.measurement import complete_meas_cal, CompleteMeasFitter
from typing import List, Dict, Tuple, Optional
import networkx as nx
from scipy.optimize import minimize
import matplotlib.pyplot as plt
from dataclasses import dataclass
import json
import logging

# Configure quantum logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class QuantumScheduleNode:
    """Represents a quantum state for course scheduling"""
    course_id: str
    time_slot: int
    day_of_week: int
    room_id: str
    professor_id: str
    student_count: int
    priority_weight: float
    quantum_state: Optional[np.ndarray] = None

@dataclass
class QuantumConstraint:
    """Quantum constraint for scheduling optimization"""
    constraint_type: str  # 'conflict', 'preference', 'capacity'
    nodes: List[int]
    penalty_weight: float
    quantum_operator: Optional[PauliSumOp] = None

class QuantumScheduleOptimizer:
    """
    Advanced quantum computing system for schedule optimization
    Uses quantum annealing and variational algorithms
    """
    
    def __init__(self, 
                 backend_name: str = 'aer_simulator',
                 shots: int = 8192,
                 optimization_level: int = 3):
        """
        Initialize quantum scheduler with advanced configuration
        
        Args:
            backend_name: Quantum backend for simulation
            shots: Number of quantum measurements
            optimization_level: Circuit optimization level (0-3)
        """
        self.backend = AerSimulator()
        self.shots = shots
        self.optimization_level = optimization_level
        self.quantum_instance = QuantumInstance(
            self.backend,
            shots=shots,
            optimization_level=optimization_level,
            measurement_error_mitigation_cls=CompleteMeasFitter,
            cals_matrix_refresh_period=30
        )
        
        # Quantum algorithm components
        self.vqe_optimizer = COBYLA(maxiter=1000)
        self.qaoa_optimizer = SPSA(maxiter=300)
        self.ansatz = None
        self.hamiltonian = None
        
        # Schedule optimization parameters
        self.schedule_nodes: List[QuantumScheduleNode] = []
        self.constraints: List[QuantumConstraint] = []
        self.quantum_graph = nx.Graph()
        
        logger.info(f"🔬 Quantum scheduler initialized with {backend_name}")
    
    def create_quantum_schedule_graph(self, courses: List[Dict]) -> nx.Graph:
        """
        Create quantum graph representation of scheduling problem
        
        Args:
            courses: List of course dictionaries
            
        Returns:
            NetworkX graph with quantum properties
        """
        logger.info("🌐 Creating quantum schedule graph...")
        
        self.quantum_graph.clear()
        self.schedule_nodes.clear()
        
        # Create quantum nodes for each course-time-room combination
        node_id = 0
        for course in courses:
            for time_slot in range(24):  # 24 possible time slots
                for day in range(7):     # 7 days of week
                    for room in range(10):  # 10 possible rooms
                        
                        # Calculate quantum priority weight
                        priority = self._calculate_quantum_priority(
                            course, time_slot, day, room
                        )
                        
                        node = QuantumScheduleNode(
                            course_id=course['id'],
                            time_slot=time_slot,
                            day_of_week=day,
                            room_id=f"room_{room}",
                            professor_id=course.get('professor_id', 'prof_unknown'),
                            student_count=course.get('student_count', 30),
                            priority_weight=priority
                        )
                        
                        self.schedule_nodes.append(node)
                        self.quantum_graph.add_node(node_id, **node.__dict__)
                        node_id += 1
        
        # Add quantum entanglement edges for constraints
        self._add_quantum_constraints()
        
        logger.info(f"✅ Created quantum graph with {len(self.schedule_nodes)} nodes")
        return self.quantum_graph
    
    def _calculate_quantum_priority(self, course: Dict, time_slot: int, 
                                  day: int, room: int) -> float:
        """
        Calculate quantum priority using superposition of preferences
        
        Args:
            course: Course information
            time_slot: Time slot (0-23)
            day: Day of week (0-6)
            room: Room number (0-9)
            
        Returns:
            Quantum priority weight
        """
        # Base priority from course importance
        base_priority = course.get('priority', 0.5)
        
        # Time preference (morning classes preferred)
        time_factor = np.exp(-((time_slot - 10) ** 2) / 20)
        
        # Day preference (weekdays preferred)
        day_factor = 1.0 if day < 5 else 0.3
        
        # Room capacity matching
        required_capacity = course.get('student_count', 30)
        room_capacity = 20 + room * 10  # Rooms have 20-110 capacity
        capacity_factor = 1.0 - abs(required_capacity - room_capacity) / 100
        
        # Quantum superposition of all factors
        quantum_priority = (
            base_priority * 0.4 +
            time_factor * 0.3 +
            day_factor * 0.2 +
            max(0, capacity_factor) * 0.1
        )
        
        return min(1.0, max(0.0, quantum_priority))
    
    def _add_quantum_constraints(self):
        """Add quantum constraints as graph edges"""
        logger.info("🔗 Adding quantum constraints...")
        
        # Professor conflict constraints
        self._add_professor_conflicts()
        
        # Room conflict constraints  
        self._add_room_conflicts()
        
        # Student schedule conflicts
        self._add_student_conflicts()
        
        # Preference constraints
        self._add_preference_constraints()
    
    def _add_professor_conflicts(self):
        """Add quantum constraints for professor scheduling conflicts"""
        professor_nodes = {}
        
        for i, node in enumerate(self.schedule_nodes):
            prof_id = node.professor_id
            time_key = (node.day_of_week, node.time_slot)
            
            if prof_id not in professor_nodes:
                professor_nodes[prof_id] = {}
            
            if time_key not in professor_nodes[prof_id]:
                professor_nodes[prof_id][time_key] = []
            
            professor_nodes[prof_id][time_key].append(i)
        
        # Add conflict edges
        for prof_id, time_slots in professor_nodes.items():
            for time_key, node_indices in time_slots.items():
                if len(node_indices) > 1:
                    # Create quantum constraint
                    constraint = QuantumConstraint(
                        constraint_type='professor_conflict',
                        nodes=node_indices,
                        penalty_weight=10.0
                    )
                    self.constraints.append(constraint)
                    
                    # Add edges to graph
                    for i in range(len(node_indices)):
                        for j in range(i + 1, len(node_indices)):
                            self.quantum_graph.add_edge(
                                node_indices[i], 
                                node_indices[j],
                                constraint_type='professor_conflict',
                                weight=10.0
                            )
    
    def _add_room_conflicts(self):
        """Add quantum constraints for room scheduling conflicts"""
        room_nodes = {}
        
        for i, node in enumerate(self.schedule_nodes):
            room_id = node.room_id
            time_key = (node.day_of_week, node.time_slot)
            
            if room_id not in room_nodes:
                room_nodes[room_id] = {}
            
            if time_key not in room_nodes[room_id]:
                room_nodes[room_id][time_key] = []
            
            room_nodes[room_id][time_key].append(i)
        
        # Add conflict edges
        for room_id, time_slots in room_nodes.items():
            for time_key, node_indices in time_slots.items():
                if len(node_indices) > 1:
                    constraint = QuantumConstraint(
                        constraint_type='room_conflict',
                        nodes=node_indices,
                        penalty_weight=8.0
                    )
                    self.constraints.append(constraint)
                    
                    for i in range(len(node_indices)):
                        for j in range(i + 1, len(node_indices)):
                            self.quantum_graph.add_edge(
                                node_indices[i],
                                node_indices[j],
                                constraint_type='room_conflict',
                                weight=8.0
                            )
    
    def _add_student_conflicts(self):
        """Add quantum constraints for student scheduling conflicts"""
        # Simplified: assume all courses have potential student overlap
        for i in range(len(self.schedule_nodes)):
            for j in range(i + 1, len(self.schedule_nodes)):
                node1 = self.schedule_nodes[i]
                node2 = self.schedule_nodes[j]
                
                # Same time slot = potential student conflict
                if (node1.day_of_week == node2.day_of_week and 
                    node1.time_slot == node2.time_slot and
                    node1.course_id != node2.course_id):
                    
                    # Calculate conflict probability
                    conflict_prob = min(node1.student_count, node2.student_count) / 100
                    
                    if conflict_prob > 0.1:  # Only add significant conflicts
                        constraint = QuantumConstraint(
                            constraint_type='student_conflict',
                            nodes=[i, j],
                            penalty_weight=conflict_prob * 5.0
                        )
                        self.constraints.append(constraint)
                        
                        self.quantum_graph.add_edge(
                            i, j,
                            constraint_type='student_conflict',
                            weight=conflict_prob * 5.0
                        )
    
    def _add_preference_constraints(self):
        """Add quantum constraints for scheduling preferences"""
        for i, node in enumerate(self.schedule_nodes):
            # Preference for morning classes
            if 8 <= node.time_slot <= 12:
                preference_weight = 2.0
            elif 13 <= node.time_slot <= 17:
                preference_weight = 1.0
            else:
                preference_weight = -1.0
            
            # Add self-loop for preference
            self.quantum_graph.add_edge(
                i, i,
                constraint_type='time_preference',
                weight=preference_weight
            )
    
    def create_quantum_hamiltonian(self) -> PauliSumOp:
        """
        Create quantum Hamiltonian for the scheduling problem
        
        Returns:
            PauliSumOp representing the optimization Hamiltonian
        """
        logger.info("⚛️ Creating quantum Hamiltonian...")
        
        num_qubits = len(self.schedule_nodes)
        pauli_list = []
        
        # Objective function: maximize priority weights
        for i, node in enumerate(self.schedule_nodes):
            pauli_str = ['I'] * num_qubits
            pauli_str[i] = 'Z'
            pauli_list.append((''.join(pauli_str), -node.priority_weight))
        
        # Constraint penalties
        for constraint in self.constraints:
            if len(constraint.nodes) == 2:
                i, j = constraint.nodes
                pauli_str = ['I'] * num_qubits
                pauli_str[i] = 'Z'
                pauli_str[j] = 'Z'
                pauli_list.append((''.join(pauli_str), constraint.penalty_weight))
        
        self.hamiltonian = PauliSumOp.from_list(pauli_list)
        logger.info(f"✅ Created Hamiltonian with {len(pauli_list)} terms")
        
        return self.hamiltonian
    
    def create_quantum_ansatz(self, num_layers: int = 3) -> QuantumCircuit:
        """
        Create variational quantum circuit ansatz
        
        Args:
            num_layers: Number of ansatz layers
            
        Returns:
            Quantum circuit ansatz
        """
        num_qubits = len(self.schedule_nodes)
        
        # Use EfficientSU2 ansatz for better expressibility
        self.ansatz = EfficientSU2(
            num_qubits=num_qubits,
            reps=num_layers,
            entanglement='circular',
            insert_barriers=True
        )
        
        logger.info(f"🔄 Created quantum ansatz with {num_layers} layers")
        return self.ansatz
    
    def solve_with_vqe(self) -> Dict:
        """
        Solve scheduling problem using Variational Quantum Eigensolver
        
        Returns:
            Dictionary with optimization results
        """
        logger.info("🧮 Solving with Variational Quantum Eigensolver...")
        
        if self.hamiltonian is None:
            self.create_quantum_hamiltonian()
        
        if self.ansatz is None:
            self.create_quantum_ansatz()
        
        # Initialize VQE
        vqe = VQE(
            ansatz=self.ansatz,
            optimizer=self.vqe_optimizer,
            quantum_instance=self.quantum_instance
        )
        
        # Solve optimization problem
        result = vqe.compute_minimum_eigenvalue(self.hamiltonian)
        
        # Extract solution
        optimal_schedule = self._extract_schedule_from_result(result)
        
        logger.info(f"✅ VQE completed with energy: {result.eigenvalue.real:.4f}")
        
        return {
            'method': 'VQE',
            'energy': result.eigenvalue.real,
            'schedule': optimal_schedule,
            'optimizer_evals': result.optimizer_evals,
            'optimal_parameters': result.optimal_parameters
        }
    
    def solve_with_qaoa(self, p_layers: int = 3) -> Dict:
        """
        Solve scheduling problem using Quantum Approximate Optimization Algorithm
        
        Args:
            p_layers: Number of QAOA layers
            
        Returns:
            Dictionary with optimization results
        """
        logger.info(f"🔀 Solving with QAOA (p={p_layers})...")
        
        if self.hamiltonian is None:
            self.create_quantum_hamiltonian()
        
        # Initialize QAOA
        qaoa = QAOA(
            optimizer=self.qaoa_optimizer,
            reps=p_layers,
            quantum_instance=self.quantum_instance
        )
        
        # Solve optimization problem
        result = qaoa.compute_minimum_eigenvalue(self.hamiltonian)
        
        # Extract solution
        optimal_schedule = self._extract_schedule_from_result(result)
        
        logger.info(f"✅ QAOA completed with energy: {result.eigenvalue.real:.4f}")
        
        return {
            'method': 'QAOA',
            'energy': result.eigenvalue.real,
            'schedule': optimal_schedule,
            'optimizer_evals': result.optimizer_evals,
            'optimal_parameters': result.optimal_parameters
        }
    
    def _extract_schedule_from_result(self, result) -> List[Dict]:
        """
        Extract human-readable schedule from quantum result
        
        Args:
            result: Quantum algorithm result
            
        Returns:
            List of scheduled courses
        """
        # Get most probable measurement outcome
        if hasattr(result, 'eigenstate'):
            # For VQE results
            probabilities = result.eigenstate.to_dict()
        else:
            # For QAOA results
            probabilities = result.eigenstate.to_dict()
        
        # Find most probable state
        most_probable_state = max(probabilities.keys(), key=lambda x: probabilities[x])
        
        # Convert binary string to schedule
        schedule = []
        for i, bit in enumerate(most_probable_state):
            if bit == '1':  # Course is scheduled
                node = self.schedule_nodes[i]
                schedule.append({
                    'course_id': node.course_id,
                    'time_slot': node.time_slot,
                    'day_of_week': node.day_of_week,
                    'room_id': node.room_id,
                    'professor_id': node.professor_id,
                    'priority_weight': node.priority_weight
                })
        
        return schedule
    
    def quantum_annealing_schedule(self, 
                                 temperature_schedule: List[float] = None) -> Dict:
        """
        Solve using simulated quantum annealing
        
        Args:
            temperature_schedule: Annealing temperature schedule
            
        Returns:
            Dictionary with annealing results
        """
        logger.info("🌡️ Starting quantum annealing optimization...")
        
        if temperature_schedule is None:
            temperature_schedule = np.logspace(2, -2, 1000).tolist()
        
        num_qubits = len(self.schedule_nodes)
        current_state = np.random.choice([0, 1], size=num_qubits)
        current_energy = self._calculate_energy(current_state)
        
        best_state = current_state.copy()
        best_energy = current_energy
        
        energy_history = []
        
        for temp in temperature_schedule:
            # Propose new state by flipping random qubit
            new_state = current_state.copy()
            flip_idx = np.random.randint(num_qubits)
            new_state[flip_idx] = 1 - new_state[flip_idx]
            
            new_energy = self._calculate_energy(new_state)
            
            # Accept or reject based on Boltzmann probability
            if new_energy < current_energy or \
               np.random.random() < np.exp(-(new_energy - current_energy) / temp):
                current_state = new_state
                current_energy = new_energy
                
                if current_energy < best_energy:
                    best_state = current_state.copy()
                    best_energy = current_energy
            
            energy_history.append(current_energy)
        
        # Convert best state to schedule
        optimal_schedule = []
        for i, bit in enumerate(best_state):
            if bit == 1:
                node = self.schedule_nodes[i]
                optimal_schedule.append({
                    'course_id': node.course_id,
                    'time_slot': node.time_slot,
                    'day_of_week': node.day_of_week,
                    'room_id': node.room_id,
                    'professor_id': node.professor_id,
                    'priority_weight': node.priority_weight
                })
        
        logger.info(f"✅ Quantum annealing completed with energy: {best_energy:.4f}")
        
        return {
            'method': 'Quantum Annealing',
            'energy': best_energy,
            'schedule': optimal_schedule,
            'energy_history': energy_history,
            'final_temperature': temperature_schedule[-1]
        }
    
    def _calculate_energy(self, state: np.ndarray) -> float:
        """
        Calculate energy of a given state
        
        Args:
            state: Binary state vector
            
        Returns:
            Energy value
        """
        energy = 0.0
        
        # Objective function: negative priority weights (minimize negative = maximize positive)
        for i, bit in enumerate(state):
            if bit == 1:
                energy -= self.schedule_nodes[i].priority_weight
        
        # Constraint penalties
        for constraint in self.constraints:
            if constraint.constraint_type in ['professor_conflict', 'room_conflict']:
                # Penalty if multiple conflicting courses are scheduled
                active_nodes = sum(state[i] for i in constraint.nodes)
                if active_nodes > 1:
                    energy += constraint.penalty_weight * (active_nodes - 1)
            
            elif constraint.constraint_type == 'student_conflict':
                # Penalty for student conflicts
                if len(constraint.nodes) == 2:
                    i, j = constraint.nodes
                    if state[i] == 1 and state[j] == 1:
                        energy += constraint.penalty_weight
        
        return energy
    
    def visualize_quantum_schedule(self, schedule: List[Dict], 
                                 save_path: str = None) -> None:
        """
        Visualize the quantum-optimized schedule
        
        Args:
            schedule: Optimized schedule
            save_path: Path to save visualization
        """
        logger.info("📊 Creating schedule visualization...")
        
        # Create schedule matrix
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        hours = list(range(8, 18))  # 8 AM to 6 PM
        
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # Plot scheduled courses
        for course in schedule:
            day_idx = course['day_of_week']
            hour = course['time_slot']
            
            if 8 <= hour <= 17:  # Only show business hours
                ax.scatter(day_idx, hour, 
                          s=course['priority_weight'] * 200,
                          alpha=0.7,
                          label=course['course_id'])
        
        ax.set_xlabel('Day of Week')
        ax.set_ylabel('Hour of Day')
        ax.set_title('Quantum-Optimized Course Schedule')
        ax.set_xticks(range(7))
        ax.set_xticklabels(days)
        ax.set_yticks(hours)
        ax.grid(True, alpha=0.3)
        ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            logger.info(f"📁 Visualization saved to {save_path}")
        
        plt.show()
    
    def export_quantum_results(self, results: Dict, 
                             filename: str = 'quantum_schedule_results.json') -> None:
        """
        Export quantum optimization results to JSON
        
        Args:
            results: Optimization results
            filename: Output filename
        """
        # Convert numpy arrays to lists for JSON serialization
        exportable_results = {}
        for key, value in results.items():
            if isinstance(value, np.ndarray):
                exportable_results[key] = value.tolist()
            else:
                exportable_results[key] = value
        
        with open(filename, 'w') as f:
            json.dump(exportable_results, f, indent=2)
        
        logger.info(f"💾 Results exported to {filename}")

# Example usage and testing
if __name__ == "__main__":
    # Initialize quantum scheduler
    quantum_scheduler = QuantumScheduleOptimizer()
    
    # Sample course data
    sample_courses = [
        {
            'id': 'CS401',
            'name': 'Advanced Algorithms',
            'professor_id': 'prof_smith',
            'student_count': 45,
            'priority': 0.9
        },
        {
            'id': 'MATH301',
            'name': 'Linear Algebra',
            'professor_id': 'prof_johnson',
            'student_count': 60,
            'priority': 0.8
        },
        {
            'id': 'PHYS201',
            'name': 'Quantum Mechanics',
            'professor_id': 'prof_wilson',
            'student_count': 30,
            'priority': 0.7
        }
    ]
    
    # Create quantum graph
    quantum_scheduler.create_quantum_schedule_graph(sample_courses)
    
    # Solve with different quantum algorithms
    print("🔬 Running quantum optimization algorithms...")
    
    # VQE solution
    vqe_result = quantum_scheduler.solve_with_vqe()
    print(f"VQE Energy: {vqe_result['energy']:.4f}")
    
    # QAOA solution
    qaoa_result = quantum_scheduler.solve_with_qaoa()
    print(f"QAOA Energy: {qaoa_result['energy']:.4f}")
    
    # Quantum annealing solution
    annealing_result = quantum_scheduler.quantum_annealing_schedule()
    print(f"Annealing Energy: {annealing_result['energy']:.4f}")
    
    # Visualize best result
    best_result = min([vqe_result, qaoa_result, annealing_result], 
                     key=lambda x: x['energy'])
    
    quantum_scheduler.visualize_quantum_schedule(best_result['schedule'])
    quantum_scheduler.export_quantum_results(best_result)
    
    print("🎉 Quantum schedule optimization completed!")
