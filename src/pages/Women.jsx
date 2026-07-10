import { useState } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProfileMianBody from '../components/ProfileMianBody';
import { Button } from 'react-bootstrap';

const WOMEN_CATEGORIES = ['All', 'Dresses', 'Tops', 'Skirts', 'Trousers','Accessories']
export default function Women() {
    const [activeCategory, setActiveCategory] = useState('All')
    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 py-4">
                    <div className="text-center py-3 border-bottom mb-4">
                        {WOMEN_CATEGORIES.map(cat => (
                            <Button
                            key={cat}
                            variant={activeCategory === cat ? 'dark' : 'outline-dark'}
                            size="sm"
                            className="me-2 mb-2"
                            style={{ borderRadius: 0, letterSpacing: '1px', fontSize: '0.8rem' }}
                            onClick={() => setActiveCategory(cat)}
                            >
                                {cat.toUpperCase()}
                            </Button>
                        ))}

                    </div>
                    
                    <ProfileMianBody genderFilter='female' 
                    categoryFilter={activeCategory === 'All' ? null : activeCategory}
                    />
                </div>
                <Footer />
            </div>
        </>
    );
}