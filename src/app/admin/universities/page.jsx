'use client';
import React, { useState, useEffect } from 'react';
import { universities as initialUniversities } from '@/lib/universitiesData';
export default function UniversitiesAdminPage() {
    const [universities, setUniversities] = useState(initialUniversities);
    const [editingIndex, setEditingIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUniversity, setNewUniversity] = useState({
        name: '',
        whatsappLink: '',
        shortName: ''
    });
    const [showAddForm, setShowAddForm] = useState(false);
    // Filter universities based on search
    const filteredUniversities = universities.filter(uni => uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (uni.shortName && uni.shortName.toLowerCase().includes(searchTerm.toLowerCase())));
    const handleEdit = (index) => {
        setEditingIndex(index);
    };
    const handleSave = (index, updatedUniversity) => {
        const newUniversities = [...universities];
        newUniversities[index] = updatedUniversity;
        setUniversities(newUniversities);
        setEditingIndex(null);
        // Here you would typically save to a database or file
        console.log('Updated university:', updatedUniversity);
    };
    const handleDelete = (index) => {
        if (confirm('Are you sure you want to delete this university?')) {
            const newUniversities = universities.filter((_, i) => i !== index);
            setUniversities(newUniversities);
        }
    };
    const handleAddNew = () => {
        if (newUniversity.name && newUniversity.whatsappLink) {
            setUniversities([...universities, newUniversity]);
            setNewUniversity({ name: '', whatsappLink: '', shortName: '' });
            setShowAddForm(false);
        }
    };
    const exportData = () => {
        const dataStr = JSON.stringify(universities, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'universities-data.json';
        link.click();
    };
    const generateCodeSnippet = () => {
        const codeSnippet = `export const universities: University[] = ${JSON.stringify(universities, null, 2)};`;
        navigator.clipboard.writeText(codeSnippet);
        alert('Code snippet copied to clipboard! You can paste this into universitiesData.ts');
    };
    return (<div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Universities Management</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
              Add University
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input type="text" placeholder="Search universities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg"/>
        </div>

        {/* Add New University Form */}
        {showAddForm && (<div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Add New University</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="University Name" value={newUniversity.name} onChange={(e) => setNewUniversity({ ...newUniversity, name: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded"/>
              <input type="text" placeholder="Short Name (optional)" value={newUniversity.shortName} onChange={(e) => setNewUniversity({ ...newUniversity, shortName: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded"/>
              <input type="url" placeholder="WhatsApp Link" value={newUniversity.whatsappLink} onChange={(e) => setNewUniversity({ ...newUniversity, whatsappLink: e.target.value })} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded"/>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Add
              </button>
              <button onClick={() => setShowAddForm(false)} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>)}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{universities.length}</div>
            <div className="text-gray-400">Total Universities</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {universities.filter(u => u.whatsappLink.includes('chat.whatsapp.com')).length}
            </div>
            <div className="text-gray-400">Valid WhatsApp Links</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {universities.filter(u => u.shortName).length}
            </div>
            <div className="text-gray-400">With Short Names</div>
          </div>
        </div>

        {/* Universities List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">University Name</th>
                  <th className="px-4 py-3 text-left">Short Name</th>
                  <th className="px-4 py-3 text-left">WhatsApp Link</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUniversities.map((university, index) => (<UniversityRow key={index} university={university} index={index} isEditing={editingIndex === index} onEdit={() => handleEdit(index)} onSave={(updatedUniversity) => handleSave(index, updatedUniversity)} onDelete={() => handleDelete(index)} onCancel={() => setEditingIndex(null)}/>))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>);
}
function UniversityRow({ university, index, isEditing, onEdit, onSave, onDelete, onCancel }) {
    const [editData, setEditData] = useState(university);
    useEffect(() => {
        setEditData(university);
    }, [university, isEditing]);
    const handleSave = () => {
        onSave(editData);
    };
    if (isEditing) {
        return (<tr className="bg-gray-750">
        <td className="px-4 py-3">
          <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"/>
        </td>
        <td className="px-4 py-3">
          <input type="text" value={editData.shortName || ''} onChange={(e) => setEditData({ ...editData, shortName: e.target.value })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"/>
        </td>
        <td className="px-4 py-3">
          <input type="url" value={editData.whatsappLink} onChange={(e) => setEditData({ ...editData, whatsappLink: e.target.value })} className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"/>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm">
              Save
            </button>
            <button onClick={onCancel} className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-sm">
              Cancel
            </button>
          </div>
        </td>
      </tr>);
    }
    return (<tr className="hover:bg-gray-750">
      <td className="px-4 py-3">
        <div className="font-medium">{university.name}</div>
      </td>
      <td className="px-4 py-3">
        <span className="bg-gray-700 px-2 py-1 rounded text-sm">
          {university.shortName || 'N/A'}
        </span>
      </td>
      <td className="px-4 py-3">
        <a href={university.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm truncate block max-w-xs">
          {university.whatsappLink}
        </a>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-sm">
            Edit
          </button>
          <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-sm">
            Delete
          </button>
        </div>
      </td>
    </tr>);
}
