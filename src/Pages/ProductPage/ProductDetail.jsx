import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetail } from '../../Features/product/productdetailSlice'; 
import { editProduct } from '../../Features/product/producteditSlice'; 
import { fetchItemImage } from '../../Features/product/itemImageDetailSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Button } from "antd";
import { EditOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import QRCode from 'qrcode.react';

function ProductDetail() {
  const dispatch = useDispatch();
  const { itemId } = useParams(); 
  const { productDataDetail: product, isLoadingProductDetail, isError } = useSelector(state => state.productDetail);
  const { itemImageDataDetail: itemImageDetail, isLoading: isLoadingImage } = useSelector(state => state.itemImageDetail);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProduct, setEditableProduct] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (itemId) {
      dispatch(fetchProductDetail(itemId));
      dispatch(fetchItemImage({ itemId, count: 1 }));
    }
  }, [dispatch, itemId]);

  useEffect(() => {
    if (product) {
      setEditableProduct(product);
    }
  }, [product]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    dispatch(editProduct({ itemId: editableProduct.itemId, productDetails: editableProduct }))
      .then(() => {
        message.success("Sản phẩm cập nhật thành công");
        setIsEditing(false);
        dispatch(fetchProductDetail(itemId));
      })
      .catch((error) => {
        message.error("Sản phẩm cập nhật thất bại");
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (isLoadingProductDetail) {
    return <div className="text-center text-black">Đang lấy thông tin....</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500">Lỗi trong quá trình lấy thông tin</div>;
  }

  if (!product) {
    return <div className="text-center">Không tìm thấy sản phẩm</div>;
  }

  const statusDisplay = editableProduct.quantity === 0 ? (
    <span className="ml-2 text-red-500">Hết Hàng</span>
  ) : (
    <span className="ml-2">{product.status}</span>
  );

  const qrCodeEnabled = editableProduct.quantity !== 0;

  return (
    <div className="bg-gray-100 w-full py-12 px-4">
      <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 ">
        <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack} className="mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{product.itemName}</h1>
        <div className="flex">
          <div className="w-1/2">
            {isLoadingImage ? (
              <div>Hình ảnh đang được load....</div>
            ) : (
              itemImageDetail && itemImageDetail.data.map((image, index) => (
                <img key={index} src={image.imageUrl} alt="Product img" className="w-1/2 h-auto mb-4 rounded" />
              ))
            )}
          </div>
          <div className="w-1/2 pl-6">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Thông tin chi tiết</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-black">
              <div className="my-2">
                <strong>Tên sản phẩm:</strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="itemName" 
                    value={editableProduct.itemName || ''} 
                    onChange={handleChange} 
                    className="ml-2 border p-1 bg-transparent"
                  />
                ) : (
                  <span className="ml-2">{product.itemName}</span>
                )}
              </div>
              <div className="my-2">
                <strong>Bộ sưu tập:</strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="accessoryType" 
                    value={editableProduct.accessoryType || ''} 
                    onChange={handleChange} 
                    className="ml-2 border p-1 bg-transparent"
                  />
                ) : (
                  <span className="ml-2">{product.accessoryType}</span>
                )}
              </div>
              <div className="my-2">
                <strong>Mã sản phẩm:</strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="itemId" 
                    value={editableProduct.itemId || ''} 
                    onChange={handleChange} 
                    className="ml-2 border p-1 bg-transparent"
                  />
                ) : (
                  <span className="ml-2">{product.itemId}</span>
                )}
              </div>
              <div className="my-2">
                <strong>Mô tả:</strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="description" 
                    value={editableProduct.description || ''} 
                    onChange={handleChange} 
                    className="ml-2 border p-1 bg-transparent"
                  />
                ) : (
                  <span className="ml-2">{product.description}</span>
                )}
              </div>
              <div className="my-2">
                <strong>Trọng lượng:</strong>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="weight" 
                    value={editableProduct.weight || ''} 
                    onChange={handleChange} 
                    className="ml-2 border p-1 bg-transparent" 
                    disabled
                  />
                ) : (
                  <span className="ml-2">{product.weight}</span>
                )}
                <span style={{ marginLeft: '8px', color: 'red', fontWeight:'bold' }}>chỉ</span>
              </div>
              <div className="my-2">
                <strong>Số lượng:</strong>
                {isEditing ? (
                  <input
                    type="text"
                    name="quantity"
                    value={editableProduct.quantity || ''}
                    onChange={handleChange}
                    className="ml-2 border p-1 bg-transparent"
                  />
                ) : (
                  <span className="ml-2">{product.quantity}</span>
                )}
              </div>
              </div>
                <div className="my-4 text-black">
                  <strong>QR Code:</strong>
                  <div className="mt-4">
                    {qrCodeEnabled && <QRCode value={product.itemId} />}
                    {!qrCodeEnabled && <div className="text-red-500 font-bold">Sản phẩm đã hết hàng</div>}
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
