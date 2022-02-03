import React from "react";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

export const ProfilePictureWidget = () => {


    const [showProfileWidget, updateShowProfileWidget] = React.useState(false);   

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const { height, width } = getWindowDimensions();
            updateShowProfileWidget(height > 600 && width > 800 ? false : true);

            window.addEventListener('resize', (_) => {
                const { height, width } = getWindowDimensions();
                updateShowProfileWidget(height > 600 && width > 800 ? false : true);
                
            });
        }
    }, [])

    return(
        showProfileWidget ?
        <div className="flex flex-row justify-center w-screen h-full absolute">
            <img src="/profile.png" className={`transition fade delay-150 w-1/8 h-1/8 my-4 mx-4 rounded-full shadow-md`}/>
        </div> : <div></div>
    )
}