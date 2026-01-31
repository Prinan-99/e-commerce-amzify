import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="product-page">
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
      {/* Product details will go here */}
    </div>
  );
};

export default ProductPage;
