import React, { useState } from 'react';
import Layout from '@theme/Layout';

export default function Admin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [authenticated, setAuthenticated] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const credentials = btoa(`${username}:${password}`);
        try {
            const res = await fetch('http://localhost:3001/api/admin/users', {
                headers: { 'Authorization': `Basic ${credentials}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
                setAuthenticated(true);
            } else {
                alert('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server');
        }
    };

    if (!authenticated) {
        return (
            <Layout title="Admin">
                <div className="container margin-vert--xl" style={{ maxWidth: '400px' }}>
                    <h1>Admin Login</h1>
                    <div className="card">
                        <div className="card__body">
                            <form onSubmit={handleLogin}>
                                <div className="margin-bottom--md">
                                    <label>Username</label>
                                    <input
                                        className="button button--block button--outline"
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        style={{ textAlign: 'left', cursor: 'text' }}
                                    />
                                </div>
                                <div className="margin-bottom--md">
                                    <label>Password</label>
                                    <input
                                        className="button button--block button--outline"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        style={{ textAlign: 'left', cursor: 'text' }}
                                    />
                                </div>
                                <button type="submit" className="button button--primary button--block">Login</button>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Admin Dashboard">
            <div className="container margin-vert--xl">
                <h1>Admin Dashboard</h1>
                <div className="card">
                    <div className="card__body">
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>AI Level</th>
                                    <th>Coding Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user: any) => (
                                    <tr key={user._id || user.id}>
                                        <td>{user._id || user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.aiExperience || '-'}</td>
                                        <td>{user.codingExperience || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
