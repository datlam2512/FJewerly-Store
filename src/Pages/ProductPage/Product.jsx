import React, { useEffect, useState } from "react";
import "./Product.scss";
import {
  Button,
  message,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Select,
  ConfigProvider,
} from "antd";
import { fetchProductData } from "../../Features/product/productSlice";
import {
  MinusCircleOutlined,
  EditOutlined,
  FileAddFilled,
  DeleteFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { removeProduct } from "../../Features/product/productdeleteSlice";
import { addProduct } from "../../Features/product/productaddSlice";
import { editProduct } from "../../Features/product/producteditSlice";
import { uploadImage } from "../../Features/product/imageUploadSlice";
import { Link } from "react-router-dom";
import Search from "antd/es/input/Search";
import { fetchProductBuyBackData } from "../../Features/product/productBuyBackSlice";

function Product() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product.productData);
  const buyBackData = useSelector(
    (state) => state.productBuyBack.producBuyBacktData
  ); 
  const isLoadingProductData = useSelector(
    (state) => state.product.isLoadingProductData
  );
  const imageUploadState = useSelector((state) => state.imageUpload);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filteredData, setFilteredData] = useState(productData);
  const [imageUrl, setImageUrl] = useState("");
  const [productType, setProductType] = useState("inStock");
  const [form] = Form.useForm();
  const buyGold24k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold24k);
  const buyGold18k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold18k);
  const buyGold14k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold14k);
  const buyGold10k = useSelector((state) => state.goldPrice.buyPrice[0]?.buyGold10k);
  const sellGold24k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold24k);
  const sellGold18k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold18k);
  const sellGold14k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold14k);
  const sellGold10k = useSelector((state) => state.goldPrice.sellPrice[0]?.sellGold10k);

  const handleProductTypeChange = (value) => {
    setProductType(value);
  };

  const showFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const showDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const showEditModal = (product) => {
    setSelectedProduct(product);
    form.setFieldsValue(product);
    setIsEditModalOpen(true);
  };

  const validateFile = (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    console.log("File type:", file.type); 
    console.log("File size:", file.size); 

    if (!validTypes.includes(file.type)) {
      message.error("Chỉ chấp nhận các định dạng ảnh (JPEG, PNG, JPG)");
      return false;
    }

    if (file.size > maxSize) {
      message.error("Kích thước ảnh không được vượt quá 5MB");
      return false;
    }

    return true;
  };

  const handleDeleteOk = () => {
    dispatch(removeProduct(selectedProduct.itemId))
      .then(() => {
        message.success("Sản phẩm xóa thành công");
        dispatch(fetchProductData());
      })
      .catch((error) => {
        message.error("Xóa sản phẩm thất bại");
      });
    setIsModalOpen(false);
  };

  const handleFilterOk = () => {
    const filteredProducts = productData.filter((product) =>
      selectedTypes.some((type) =>
        product.itemName.toLowerCase().includes(type.toLowerCase())
      )
    );
    setFilteredData(filteredProducts);
    setIsFilterModalOpen(false);
  };

  const handleFilterCancel = () => {
    setIsFilterModalOpen(false);
  };

  const handleSearch = (value) => {
    const filteredProducts = productData.filter(
      (product) =>
        product.itemName.toLowerCase().includes(value.toLowerCase()) ||
        product.itemId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filteredProducts);
  };

  const handleTypeChange = (checkedValues) => {
    setSelectedTypes(checkedValues);
  };

  const handleAddOk = () => {
    form
      .validateFields()
      .then((values) => {
        const productData = {
          ...values,
          isBuyBack: false,
          itemImagesId: imageUrl,
          weight: values.weight.toString(), // Use the uploaded image URL
        };
        dispatch(addProduct(productData))
          .then(() => {
            message.success("Thêm sản phẩm thành công");
            dispatch(fetchProductData());
            form.resetFields();
            setSelectedFiles(null);
            setImageUrl("");
          })
          .catch((error) => {
            message.error("Thêm sản phẩm thất bại");
          });
        setIsAddModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Xác thực thất bại:", errorInfo);
      });
  };

  const handleUpload = async (file) => {
    if (!file) {
      message.error("Không có file được chọn");
      return;
    }

    const itemId = selectedProduct ? selectedProduct.itemId : ""; // Use selectedProduct's itemId if available

    try {
      const resultAction = await dispatch(uploadImage({ file, itemId }));

      if (uploadImage.fulfilled.match(resultAction)) {
        setImageUrl(resultAction.payload.imageUrl);
        message.success("Tải lên thành công!");
      } else {
        message.error("Tải lên thất bại!");
      }
    } catch (error) {
      console.error("Upload failed", error);
      message.error("Tải lên thất bại!");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Add this
    if (file && validateFile(file)) {
      handleUpload(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFiles(null);
  };

  const handleRefresh = () => {
    setFilteredData(productData);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedProductData = {
          ...values,
          itemImagesId: imageUrl || selectedProduct.itemImagesId,
        };
        dispatch(
          editProduct({
            itemId: selectedProduct.itemId,
            productDetails: updatedProductData,
          })
        )
          .then(() => {
            message.success("Sản phẩm cập nhật thành công");
            dispatch(fetchProductData());
            form.resetFields();
            setImageUrl(""); // Reset imageUrl state
          })
          .catch((error) => {
            message.error("Cập nhật sản phẩm thất bại");
          });
        setIsEditModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Xác thực thất bại:", errorInfo);
      });
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setSelectedFiles(null);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "itemId",
      key: "itemId",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã Hàng",
      dataIndex: "itemId",
      key: "itemId",
    },
    {
      title: "Tên Hàng",
      dataIndex: "itemName",
      key: "itemName",
      render: (text, record) => (
        <Link
          className="text-blue-500"
          to={`/product/productdetail/${record.itemId}`}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Loại Vàng",
      dataIndex: "goldType",
      key: "goldType",
      width: 100,
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }
        return goldType;
      },
    },
    {
      title: "Trọng Lượng",
      dataIndex: "weight",
      key: "weight",
      width: 120,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) =>
        quantity === 0 ? (
          <span style={{ color: "red" }}>Hết hàng</span>
        ) : (
          <span>{quantity}</span>
        ),
    },
    {
      title: "Giá mua lại",
      dataIndex: "buyPrice",
      key: "buyPrice",
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }

        let kara;
        switch (goldType) {
          case "10K":
            kara = buyGold10k;
            break;
          case "14K":
            kara = buyGold14k;
            break;
          case "18K":
            kara = buyGold18k;
            break;
          case "24K":
            kara = buyGold24k;
            break;
          default:
            kara = 0;
        }

        const buyPrice = record.weight * 1 * kara; 
        return `${Number(buyPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
    {
      title: "Giá bán ra",
      dataIndex: "sellPrice",
      key: "sellPrice",
      render: (_, record) => {
        let goldType = "";
        if (record.itemName.toLowerCase().includes("10k")) {
          goldType = "10K";
        } else if (record.itemName.toLowerCase().includes("14k")) {
          goldType = "14K";
        } else if (record.itemName.toLowerCase().includes("18k")) {
          goldType = "18K";
        } else if (record.itemName.toLowerCase().includes("24k")) {
          goldType = "24K";
        }

        let sellKara;
        switch (goldType) {
          case "10K":
            sellKara = sellGold10k; 
            break;
          case "14K":
            sellKara = sellGold14k; 
            break;
          case "18K":
            sellKara = sellGold18k; 
            break;
          case "24K":
            sellKara = sellGold24k; 
            break;
          default:
            sellKara = 0;
        }

        const sellPrice = record.weight * 1 * sellKara; 
        return `${Number(sellPrice.toFixed(0)).toLocaleString()}đ`;
      },
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            className="text-green-400 hover:text-green-600 transition duration-300"
            onClick={() => showEditModal(record)}
          >
            <EditOutlined />
          </button>
          <button
            className="text-red-400 hover:text-red-600 transition duration-300"
            onClick={() => showDeleteModal(record)}
          >
            <MinusCircleOutlined />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    dispatch(fetchProductData());
  }, [dispatch]);

  useEffect(() => {
    if (productType === "inStock") {
      dispatch(fetchProductData());
    } else {
      dispatch(fetchProductBuyBackData());
    }
  }, [productType]);

  useEffect(() => {
    if (productType === "inStock") {
      setFilteredData(productData);
    } else {
      setFilteredData(buyBackData.data);
    }
  }, [productType, productData, buyBackData.data]);

  useEffect(() => {
    if (productData) {
      const filteredProducts = productData.filter(
        (product) => !product.isBuyBack && product.status !== "Deleted"
      );
      setFilteredData(filteredProducts);
    }
  }, [productData]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "var(--primary-color)",
          colorPrimaryHover: "var(--primary-color-hover)",
        },
        components: {
          Select: {
            optionSelectedBg: "#dbdbdb",
          },
        },
      }}
    >
      <div className="w-full mt-12">
        <h1 className="text-2xl font-bold mb-0 ml-5 text-black">Sản Phẩm</h1>
        <div className="w-full flex justify-center">
          <div className="Product w-[96%] mt-4">
            <div className="w-full mb-1 flex justify-between">
              <div className="flex w-[85%]">
                <Search
                  allowClear
                  onClear={handleRefresh}
                  placeholder="Tìm kiếm theo tên hoặc ID sản phẩm"
                  onSearch={handleSearch}
                  style={{ width: "50%", marginRight: "10px" }}
                />
                <Select
                  defaultValue="inStock"
                  placeholder="Chọn loại sản phẩm"
                  onChange={(value) => handleProductTypeChange(value)}
                  style={{ width: 200 }}
                >
                  <Select.Option value="inStock">
                    Sản phẩm bán hàng
                  </Select.Option>
                  <Select.Option value="buyBack">
                    Sản phẩm mua lại
                  </Select.Option>
                </Select>
              </div>

              <div className="all-btn flex">
                <Button
                  type="primary"
                  className="filter-button mr-4"
                  onClick={showFilterModal}
                >
                  Lọc sản phẩm
                </Button>
                <Button
                  className="add-product-btn"
                  type="primary"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{ marginBottom: 16 }}
                >
                  <FileAddFilled />
                  Thêm sản phẩm
                </Button>
                <Button
                  className="refresh-btn"
                  type="primary"
                  onClick={handleRefresh}
                  style={{ marginBottom: 16, marginLeft: 16 }}
                >
                  Làm mới
                </Button>
              </div>
            </div>

            <Table
              dataSource={filteredData}
              columns={columns}
              loading={isLoadingProductData}
              rowKey="itemId"
              className="font-semibold"
            />

            <Modal
              title="Xóa sản phẩm"
              open={isModalOpen}
              onOk={handleDeleteOk}
              onCancel={handleDeleteCancel}
            >
              <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
            </Modal>

            <Modal
              title="Thêm sản phẩm"
              open={isAddModalOpen}
              onOk={handleAddOk}
              onCancel={handleAddCancel}
            >
              <Form form={form}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="itemName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="accessoryType"
                  label="Loại hàng"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại hàng" },
                  ]}
                >
                  <Select placeholder="Chọn loại hàng">
                    <Select.Option value="Nhẫn">Nhẫn</Select.Option>
                    <Select.Option value="Vòng tay">Vòng tay</Select.Option>
                    <Select.Option value="Dây chuyền">Dây chuyền</Select.Option>
                    <Select.Option value="Dây chuyền">Bông tay</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả sản phẩm!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="weight"
                  label="Trọng Lượng"
                  rules={[
                    { required: true, message: "Vui lòng nhập trọng lượng" },
                  ]}
                >
                  <InputNumber min={1} /> 
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng sản phẩm!",
                    },
                  ]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Upload ảnh mới" name="imageUpload">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Cập nhật sản phẩm"
              open={isEditModalOpen}
              onOk={handleEditOk}
              onCancel={handleEditCancel}
            >
              <Form form={form}>
                <Form.Item
                  label="Tên sản phẩm"
                  name="itemName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="itemId"
                  label="Mã sản phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã sản phẩm" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="accessoryType"
                  label="Loại hàng"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại hàng" },
                  ]}
                >
                  <Select placeholder="Chọn loại hàng">
                    <Select.Option value="Nhẫn">Nhẫn</Select.Option>
                    <Select.Option value="Vòng tay">Vòng tay</Select.Option>
                    <Select.Option value="Dây chuyền">Dây chuyền</Select.Option>
                    <Select.Option value="Dây chuyền">Bông tay</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="weight"
                  label="Trọng Lượng"

                  rules={[
                    { required: true, message: "Vui lòng nhập trọng lượng" },
                  ]}
                >
                  <InputNumber min={1}  disabled />

                </Form.Item>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả sản phẩm!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số lượng sản phẩm!",
                    },
                  ]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="Upload ảnh mới" name="imageUpload">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Lọc sản phẩm"
              open={isFilterModalOpen}
              onOk={handleFilterOk}
              onCancel={handleFilterCancel}
            >
              <Form>
                <Form.Item label="Loại vàng">
                  <Checkbox.Group onChange={handleTypeChange}>
                    <Checkbox value="10k">10K</Checkbox>
                    <Checkbox value="14k">14K</Checkbox>
                    <Checkbox value="18k">18K</Checkbox>
                    <Checkbox value="24k">24K</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Product;
