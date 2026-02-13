// ALPHA TRECKER - Database Service (localStorage-based)

import type { User, Airdrop, Task } from '@/types';
import { hashPassword, generateId } from './crypto';

const DB_KEYS = {
  USERS: 'alpha_trecker_users',
  AIRDROP: 'alpha_trecker_airdrops',
  CURRENT_USER: 'alpha_trecker_current_user',
};

// User Operations
export async function createUser(username: string, password: string): Promise<User | null> {
  const users = getUsers();
  
  if (users.find(u => u.username === username)) {
    return null; // Username already exists
  }
  
  const newUser: User = {
    id: generateId(),
    username,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  return newUser;
}

export function getUsers(): User[] {
  const data = localStorage.getItem(DB_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find(u => u.username === username);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

// Airdrop Operations
export function createAirdrop(airdrop: Omit<Airdrop, 'id' | 'createdAt' | 'updatedAt'>): Airdrop {
  const newAirdrop: Airdrop = {
    ...airdrop,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const airdrops = getAirdrops();
  airdrops.push(newAirdrop);
  localStorage.setItem(DB_KEYS.AIRDROP, JSON.stringify(airdrops));
  return newAirdrop;
}

export function getAirdrops(): Airdrop[] {
  const data = localStorage.getItem(DB_KEYS.AIRDROP);
  return data ? JSON.parse(data) : [];
}

export function getAirdropsByUserId(userId: string): Airdrop[] {
  const all = getAirdrops();

  console.log("ALL AIRDROPS:", all);
  console.log("FILTER USER:", userId);

  return all.filter(a => a.userId === userId);
}

export function getAirdropById(id: string): Airdrop | undefined {
  return getAirdrops().find(a => a.id === id);
}

export function updateAirdrop(id: string, updates: Partial<Airdrop>): Airdrop | null {
  const airdrops = getAirdrops();
  const index = airdrops.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  airdrops[index] = {
    ...airdrops[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(DB_KEYS.AIRDROP, JSON.stringify(airdrops));
  return airdrops[index];
}

export function deleteAirdrop(id: string): boolean {
  const airdrops = getAirdrops();
  const filtered = airdrops.filter(a => a.id !== id);
  
  if (filtered.length === airdrops.length) return false;
  
  localStorage.setItem(DB_KEYS.AIRDROP, JSON.stringify(filtered));
  return true;
}

// Task Operations
export function addTask(airdropId: string, title: string): Task | null {
  const airdrop = getAirdropById(airdropId);
  if (!airdrop) return null;
  
  const newTask: Task = {
    id: generateId(),
    airdropId,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const tasks = [...airdrop.tasks, newTask];
  updateAirdrop(airdropId, { tasks });
  return newTask;
}

export function updateTask(airdropId: string, taskId: string, updates: Partial<Task>): Task | null {
  const airdrop = getAirdropById(airdropId);
  if (!airdrop) return null;
  
  const taskIndex = airdrop.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return null;
  
  airdrop.tasks[taskIndex] = {
    ...airdrop.tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  updateAirdrop(airdropId, { tasks: airdrop.tasks });
  return airdrop.tasks[taskIndex];
}

export function deleteTask(airdropId: string, taskId: string): boolean {
  const airdrop = getAirdropById(airdropId);
  if (!airdrop) return false;
  
  const tasks = airdrop.tasks.filter(t => t.id !== taskId);
  updateAirdrop(airdropId, { tasks });
  return true;
}

export function toggleTask(airdropId: string, taskId: string): Task | null {
  const airdrop = getAirdropById(airdropId);
  if (!airdrop) return null;
  
  const task = airdrop.tasks.find(t => t.id === taskId);
  if (!task) return null;
  
  return updateTask(airdropId, taskId, { completed: !task.completed });
}

// Session Operations
export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

// Initialize demo data
export function initializeDemoData(): void {
  const users = getUsers();
  if (users.length === 0) {
    // Create demo user
    hashPassword('demo123').then(hash => {
      const demoUser: User = {
        id: generateId(),
        username: 'demo',
        passwordHash: hash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([demoUser]));
    });
  }
}
