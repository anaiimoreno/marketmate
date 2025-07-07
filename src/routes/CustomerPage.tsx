import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { db } from '../firebase';
import { getDocs, collection } from 'firebase/firestore';
import '../styles/InventoryPage.css';

type Item = {
  id: string;
  label: string;
  price: string;
  unit: 'Pound' | 'Each';
  imageUrl: string;
};

const categories = ['Dairy', 'Vegetables', 'Fruit'];

const CustomerPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Dairy');
  const [items, setItems] = useState<{ [key: string]: Item[] }>({
    Dairy: [],
    Vegetables: [],
    Fruit: [],
  });

  const loadItems = async () => {
    const snapshot = await getDocs(collection(db, selectedCategory));
    const loaded = snapshot.docs.map(doc => doc.data() as Item);
    setItems(prev => ({ ...prev, [selectedCategory]: loaded }));
  };

  useEffect(() => {
    loadItems();
  }, [selectedCategory]);

  return (
    <>
      <Navbar />
      <div className="inventory-container">
        <h1>Customer</h1>

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

          <div className="item-cards-container">
            {items[selectedCategory]?.map((item, index) => (
              <div className="item-card" key={index}>
                <h3 className="item-id">Item #: {item.id}</h3>
                <div className="image-preview">
                  <img src={item.imageUrl} alt={item.label} />
                </div>
                <div className="form-group">
                  <label>LABEL</label>
                  <input type="text" value={item.label} disabled />
                </div>
                <div className="form-group">
                  <label>PRICE</label>
                  <input type="text" value={`$${item.price} / ${item.unit}`} disabled />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerPage;
