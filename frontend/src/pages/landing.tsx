import bgImage from '../assets/bg.png';

export const Landing = () => {
    return (
        <div 
            className="flex justify-center items-center h-screen "
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div></div>
        </div>
    )
}