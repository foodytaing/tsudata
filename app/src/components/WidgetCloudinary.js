import React from "react";

import { WidgetLoader, Widget } from 'react-cloudinary-upload-widget'

const WidgetCloudinary = (props) => {
    const {
        onSuccess
    } = props

    return (
        <>
            <WidgetLoader />
            <Widget
                cloudName={process.env.REACT_APP_CLOUDNAME}
                uploadPreset={process.env.REACT_APP_UPLOADPRESET}
                buttonText={'Upload une image'}
                style={{

                }}
                onSuccess={onSuccess}
            />
        </>
    );
};

export default WidgetCloudinary;