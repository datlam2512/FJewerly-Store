import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Input, Button, message } from 'antd';
import './ExchangeRatePage.scss';
import { getMultipliers, updateMultipliers } from '../../Services/api/multiplier';
import { jwtDecode } from 'jwt-decode';

const ExchangeRatePage = () => {
    const { buyPrice, sellPrice } = useSelector((state) => state.goldPrice);
    const tableRef = useRef(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [buyMultiplier, setBuyMultiplier] = useState(null);
    const [sellMultiplier, setSellMultiplier] = useState(null);
    const [multiplierId, setMultiplierId] = useState(null);
    const [role, setRole] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
        }
    }, []);
    useEffect(() => {
        const fetchMultipliers = async () => {
            try {
                const { id, buyMultiplier, sellMultiplier } = await getMultipliers();
                setMultiplierId(id);
                setBuyMultiplier(buyMultiplier);
                setSellMultiplier(sellMultiplier);
            } catch (error) {
                console.error('Error fetching multipliers:', error);
            }
        };

        fetchMultipliers();
    }, []);

    const goldPrice = buyPrice.map((buyItem, index) => ({
        ...buyItem,
        ...sellPrice[index],
    }));

    const handleFullScreen = () => {
        const element = tableRef.current;
        if (element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) { /* Firefox */
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) { /* IE/Edge */
                element.msRequestFullscreen();
            }
        } else {
            console.error('Element is null');
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleBuyMultiplierChange = (e) => {
        setBuyMultiplier(e.target.value);
    };

    const handleSellMultiplierChange = (e) => {
        setSellMultiplier(e.target.value);
    };

    const handleUpdateMultipliers = async () => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Thay đổi cần tải lại trang. Bạn có muốn thực hiện việc này?',
            okText: 'Có',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await updateMultipliers(multiplierId, parseFloat(buyMultiplier), parseFloat(sellMultiplier));
                    message.success('Cập nhật thành công');
                    window.location.reload(); // Refresh the page after successful update
                } catch (error) {
                    console.error('Error updating multipliers:', error);
                    message.error('Cập nhật thất bại');
                }
            },
        });
    };

    return (
        <div className='w-full block text-black'>
            <div className="w-11/12 mt-10 block justify-center mx-auto">
                <h2 className="w-full text-center text-2xl font-semibold">Giá Vàng Hôm Nay</h2>
                <div className="button-container w-full flex justify-center mt-9">
                    <Button className="full-screen-button" onClick={handleFullScreen}>Toàn màn hình</Button>
                    {(role === "Admin" || role === "Manager") && (
                        <Button className="adjust-multiplier-button" onClick={openModal}>Điều chỉnh tỷ lệ áp giá</Button>
                    )}
                </div>
                <div ref={tableRef} className="table-container w-full flex justify-center mt-9" style={{ backgroundColor: "#F5F5F5" }}>
                    <table className="gold-price-table w-4/5 text-center border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="py-3 text-lg bg-[#1e1e28] text-white">Loại vàng</th>
                                <th className="py-3 text-lg bg-[#1e1e28] text-white">Giá Mua (đ)</th>
                                <th className="py-3 text-lg bg-[#1e1e28] text-white">Giá Bán (đ)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goldPrice.map((item, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td className="py-4 text-base font-medium">Vàng 24K</td>
                                        <td className="py-4 text-base font-medium">{Number(item.buyGold24k).toLocaleString()}</td>
                                        <td className="py-4 text-base font-medium">{Number(item.sellGold24k).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-base font-medium">Vàng 18K</td>
                                        <td className="py-4 text-base font-medium">{Number(item.buyGold18k).toLocaleString()}</td>
                                        <td className="py-4 text-base font-medium">{Number(item.sellGold18k).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-base font-medium">Vàng 14K</td>
                                        <td className="py-4 text-base font-medium">{Number(item.buyGold14k).toLocaleString()}</td>
                                        <td className="py-4 text-base font-medium">{Number(item.sellGold14k).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-4 text-base font-medium">Vàng 10K</td>
                                        <td className="py-4 text-base font-medium">{Number(item.buyGold10k).toLocaleString()}</td>
                                        <td className="py-4 text-base font-medium">{Number(item.sellGold10k).toLocaleString()}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-10 ml-8 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-[20px]">Nguồn:</h4>
                <div className="mt-4">
                    <p className="mb-2">Tỷ giá chuyển đổi: <a href="https://www.exchangerate-api.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">exchangerate-api.com</a></p>
                    <p>Tỷ giá vàng: <a href="https://www.gold-api.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">gold-api.com</a></p>
                </div>
            </div>
            <Modal title="Điều chỉnh tỷ lệ áp giá" visible={modalIsOpen} onCancel={closeModal} onOk={handleUpdateMultipliers}>
                <div>
                    <label htmlFor="buyMultiplier">Tỉ lệ Mua:</label>
                    <Input id="buyMultiplier" value={buyMultiplier} onChange={handleBuyMultiplierChange} type="number" />
                </div>
                <div>
                    <label htmlFor="sellMultiplier">Tỉ lệ Bán:</label>
                    <Input id="sellMultiplier" value={sellMultiplier} onChange={handleSellMultiplierChange} type="number" />
                </div>
            </Modal>
        </div>
    );
};

export default ExchangeRatePage;
