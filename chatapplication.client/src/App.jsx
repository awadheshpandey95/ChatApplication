import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import VerifyOTP from './Components/VerifyOTP';
import ChatApp from './Components/Chat/ChatApp';

function App() {
    return (
        <div className='container-fluid px-0'>
            {/* <Navbar /> */}
            {/* Main content */}
            <main className="application-bg-color">
                {/* <Chat /> */}
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/Signup" element={<Signup />} />
                        <Route path="/VerifyOTP" element={<VerifyOTP />} />
                        <Route path="/ChatApp" element={<ChatApp />} />
                    </Routes>
                </Router>
            </main>
        </div>
    );
}

export default App;
