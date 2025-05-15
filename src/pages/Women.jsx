import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProfileMianBody from '../components/ProfileMianBody';


export default function Women() {
    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 py-4">
                    <ProfileMianBody genderFilter='female' />
                </div>
                <Footer />
            </div>
        </>
    );
}