import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data));
  }, []);
  return (
    <div className="product-list">
      {products.map(product => <ProductCard key={product._id} product={product} />)}
    </div>
  );
}
export default ProductList;