import { Badge, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function FloatingCart({ onClick }) {
    const orders = useSelector((state) => state.orders.orders);
    const ordersCount = orders.reduce((accumulator, item) => {
        return accumulator + item.qty;
    }, 0);

    return (
        <Button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 1000,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
            className="floating-cart-btn"
        >
            <i className='bi bi-bag fs-5'></i>
            {ordersCount > 0 && (
                <Badge
                    pill
                    bg='light'
                    text='dark'
                    style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px'
                    }}
                >
                    {ordersCount}
                </Badge>
            )}
        </Button>
    );
}