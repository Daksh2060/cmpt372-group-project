import { useNavigate } from "react-router";

const HomePage = () => {

    const navigate = useNavigate();

    const handleMap = () => {
        navigate('/map');
    }
    
    return (
    <div>
        <h1>Homepage</h1>
        <div className="new">
            <button onClick={handleMap}>GO TO MAP</button>
        </div>
    </div>
    );
};

export default HomePage;
