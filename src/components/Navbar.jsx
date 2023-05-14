import Link from '@mui/material/Link';
import GitHubIcon from '@mui/icons-material/GitHub';
import AlgoSelect from "./AlgoSelect.jsx";

export default function Navbar() {
    return ( 
        <div className="navbar">
            <Link href="https://github.com/anshuthopsee/maze-generator">
                <GitHubIcon sx={{px: 1, fill: "black"}}/>
            </Link>
            <div className="header code">MAZE GENERATOR</div>
            <AlgoSelect/>
        </div>
    );
};