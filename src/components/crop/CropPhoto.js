import React from "react";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import personImg from "../assets/images/img1.png";
import minusBtn from "../assets/images/minusBtn.svg";
import plusBtn from "../assets/images/plusBtn.svg";
import getCroppedImg from "../utils/editImage";
import pointerBtn from "../assets/images/pointer.svg";

import "./cropPhoto.scss";

const CropPhoto = () => {
  const [isTouched, setIsTouched] = useState(false);
  const [croppedImage, setCroppedImage] = useState();
  const [photo, setPhoto] = useState();
  const [previewPhoto, setPreviewPhoto] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [cropedAreaPixels, setCropedAreaPixels] = useState(null);

  useEffect(() => {
    if (!photo) {
      setPreviewPhoto(personImg);
      setCroppedImage(personImg);
      return;
    }
    const objUrl = URL.createObjectURL(photo);
    setPreviewPhoto(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [photo]);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCropedAreaPixels(croppedAreaPixels);
  };

  const onFileUpload = (e) => {
    const newPhoto = e.target.files[0];

    if (newPhoto) {
      setPhoto(newPhoto);
    }
  };

  const plusBtnHandler = (e) => {
    e.preventDefault();
    if (zoom === 3) {
      return;
    }

    setZoom((prev) => prev + 0.1);
  };

  const minuBtnHandler = (e) => {
    e.preventDefault();
    if (zoom === 1) {
      return;
    }
    setZoom((prev) => prev - 0.1);
  };

  const cropAndSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const croppedImage = await getCroppedImg(
          previewPhoto,
          cropedAreaPixels
        );
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    },
    [cropedAreaPixels, previewPhoto]
  );

  const clearCropSize = (e) => {
    e.preventDefault();
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropedAreaPixels(null);
  };

  return (
    <div className="crop_img_container">
      <img
        src={croppedImage}
        alt=""
        style={{ width: "75px", height: "75px", borderRadius: "50%" }}
      />
      <div className="crop_img_bg">
        <div className="crop_img_wrapper">
          <h2>Zdjęcie profilowe</h2>
          <p>Dodaj lub zmień obecne zdjęcie profilowe</p>
          <form>
            <div className="upload_btn">
              <span>Dodaj zdjęcie</span>
              <input type="file" accept="image/*" onChange={onFileUpload} />
            </div>

            <div className="img_cropper__container">
              {!isTouched && (
                <div className="pointer__container">
                  <div className="pointer__bg"></div>
                  <img src={pointerBtn} alt="img" />
                  <p>Przeciągaj i dopasuj</p>
                </div>
              )}
              <Cropper
                crop={crop}
                zoom={zoom}
                aspect={1}
                onZoomChange={setZoom}
                onCropChange={setCrop}
                onCropComplete={cropComplete}
                image={previewPhoto}
                cropShape="round"
                showGrid={false}
                onInteractionStart={() => setIsTouched(true)}
              />
            </div>
            <div className="slider__container">
              <button onClick={minuBtnHandler}>
                <img src={minusBtn} alt="img" />
              </button>
              <Slider
                classes={{
                  root: "slider_root",
                  track: "mui_track",
                  rail: "mui_rail",
                  thumb: "mui_thumb",
                }}
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e, zoom) => setZoom(zoom)}
              />
              <button onClick={plusBtnHandler}>
                <img src={plusBtn} alt="img" />
              </button>
            </div>
            <div className="cropper_btn__container">
              <button className="clear__btn" onClick={clearCropSize}>
                Anuluj
              </button>
              <button className="save__btn" onClick={cropAndSubmitHandler}>
                Zapisz zmiany
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CropPhoto;
