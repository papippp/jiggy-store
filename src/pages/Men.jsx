import { useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProfileMianBody from '../components/ProfileMianBody';
import { Button } from 'react-bootstrap';

const MEN_CATEGORIES = ['All','T-shirts','Shirts', 'Shorts','Trousers','Accessories']
export default function Men() {
    const [activeCategory, setActiveCategory] = useState('All')
    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 py-4">
                    <div className="text-center py-3 border-bottom mb-4">
                        {MEN_CATEGORIES.map( cat => (
                            <Button key={cat}
                             variant={activeCategory === cat ? 'dark' : 'outline-dark'}
                             size='sm'
                             className='me-2 mb-2'
                             style={{ borderRadius: 0, letterSpacing: '1px', fontSize: '0.8rem' }}
                             onClick={() => setActiveCategory(cat)}
                            >
                                {cat.toUpperCase()}

                            </Button>
                        ))}
                    </div>
                    <ProfileMianBody genderFilter='male'
                    categoryFilter={activeCategory === 'All' ? null : activeCategory}
                    />

                </div>
                <Footer />
            </div>
        </>
    );
}