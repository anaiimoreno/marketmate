import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import '../styles/InventoryPage.css';

type Item = {
  id: string;
  label: string;
  price: string;
  unit: 'Pound' | 'Each';
  imageUrl: string;
  isEditing?: boolean;
  docId?: string;
};

const categories = ['Dairy', 'Vegetables', 'Fruit'];

const InventoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dairy');
  const [items, setItems] = useState<{ [key: string]: Item[] }>({
    Dairy: [],
    Vegetables: [],
    Fruit: [],
  });

  const [formData, setFormData] = useState({
    id: '',
    label: '',
    price: '',
    unit: 'Pound' as 'Pound' | 'Each',
    imageUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (unit: 'Pound' | 'Each') => {
    setFormData({ ...formData, unit });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleSaveItem = async () => {
    if (!formData.id || !formData.label || !formData.price || !formData.imageUrl) {
      alert('All fields required.');
      return;
    }

    const newItem = {
      id: formData.id,
      label: formData.label,
      price: formData.price,
      unit: formData.unit,
      imageUrl: formData.imageUrl,
    };

    await addDoc(collection(db, selectedCategory), newItem);

    setFormData({
      id: '',
      label: '',
      price: '',
      unit: 'Pound',
      imageUrl: '',
    });

    loadItems(); // refresh list
  };

  const loadItems = async () => {
    const snapshot = await getDocs(collection(db, selectedCategory));
    const loaded: Item[] = snapshot.docs.map(docSnap => ({
      ...(docSnap.data() as Item),
      docId: docSnap.id,
      isEditing: false,
    }));

    setItems(prev => ({
      ...prev,
      [selectedCategory]: loaded,
    }));
  };

  const updateItemField = async (
    index: number,
    updatedFields: Partial<Item>
  ) => {
    const item = items[selectedCategory][index];
    const updatedItem = { ...item, ...updatedFields };
    const updatedItems = [...items[selectedCategory]];
    updatedItems[index] = updatedItem;

    setItems(prev => ({
      ...prev,
      [selectedCategory]: updatedItems,
    }));

    if (item.docId) {
      const docRef = doc(db, selectedCategory, item.docId);
      await updateDoc(docRef, updatedFields);
    }
  };

  const toggleEdit = (index: number) => {
    const updatedItems = [...items[selectedCategory]];
    const item = updatedItems[index];

    if (item.isEditing && item.docId) {
      updateDoc(doc(db, selectedCategory, item.docId), {
        label: item.label,
        price: item.price,
        unit: item.unit,
        imageUrl: item.imageUrl,
      });
    }

    updatedItems[index] = {
      ...item,
      isEditing: !item.isEditing,
    };

    setItems(prev => ({
      ...prev,
      [selectedCategory]: updatedItems,
    }));
  };

  const deleteItem = async (index: number) => {
    const item = items[selectedCategory][index];

    if (!item.docId) return;

    try {
      await deleteDoc(doc(db, selectedCategory, item.docId));

      const updatedItems = [...items[selectedCategory]];
      updatedItems.splice(index, 1);

      setItems(prev => ({
        ...prev,
        [selectedCategory]: updatedItems,
      }));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="inventory-container">
        <h1>Manager</h1>

        <div className="category-section">
          {categories.map(category => (
            <div key={category} className="category-card">
              <button
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            </div>
          ))}
        </div>

        <div className="display-section">
          <h2>Now Showing: {selectedCategory}</h2>

          {/* Form */}
          <div className="item-form">
            <div className="form-group">
              <label>ITEM #</label>
              <input name="id" value={formData.id} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>LABEL</label>
              <input name="label" value={formData.label} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>PRICE</label>
              <input name="price" value={formData.price} onChange={handleInputChange} />
              <div className="unit-toggle">
                <button
                  className={formData.unit === 'Pound' ? 'unit-btn active' : 'unit-btn'}
                  onClick={() => handleUnitChange('Pound')}
                >
                  Pound
                </button>
                <button
                  className={formData.unit === 'Each' ? 'unit-btn active' : 'unit-btn'}
                  onClick={() => handleUnitChange('Each')}
                >
                  Each
                </button>
              </div>
            </div>
            <div className="form-group image-upload">
              <label htmlFor="file-upload" className="image-label">Add image</label>
              <input type="file" id="file-upload" onChange={handleImageUpload} />
            </div>
            <button className="save-btn" onClick={handleSaveItem}>Save</button>
          </div>

          {/* Items */}
          <div className="item-cards-container">
            {items[selectedCategory]?.map((item, index) => (
              <div className="item-card" key={index}>
                <h3 className="item-id">Item #: {item.id}</h3>

                <div className="image-preview">
                  {item.isEditing ? (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          updateItemField(index, { imageUrl: url });
                        }
                      }}
                    />
                  ) : (
                    <img src={item.imageUrl} alt={item.label} />
                  )}
                </div>

                <div className="form-group">
                  <label>LABEL</label>
                  <input
                    type="text"
                    value={item.label}
                    disabled={!item.isEditing}
                    onChange={
                      item.isEditing
                        ? (e) => updateItemField(index, { label: e.target.value })
                        : undefined
                    }
                  />
                </div>

                <div className="form-group">
                  <label>PRICE</label>
                  <input
                    type="text"
                    value={item.isEditing ? item.price : `$${item.price} / ${item.unit}`}
                    disabled={!item.isEditing}
                    onChange={
                      item.isEditing
                        ? (e) => updateItemField(index, { price: e.target.value })
                        : undefined
                    }
                  />
                </div>

                {item.isEditing && (
                  <div className="unit-toggle">
                    <button
                      className={item.unit === 'Pound' ? 'unit-btn active' : 'unit-btn'}
                      onClick={() => updateItemField(index, { unit: 'Pound' })}
                    >
                      Pound
                    </button>
                    <button
                      className={item.unit === 'Each' ? 'unit-btn active' : 'unit-btn'}
                      onClick={() => updateItemField(index, { unit: 'Each' })}
                    >
                      Each
                    </button>
                  </div>
                )}

                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => toggleEdit(index)}>
                    {item.isEditing ? 'Save' : 'Edit'}
                  </button>
                  <button className="delete-btn" onClick={() => deleteItem(index)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryPage;
