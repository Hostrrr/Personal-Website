import React, { useState } from 'react'
import './AboutMeWindowContent.css'
import { useLanguage } from '../../../contexts/LanguageContext'
import { PixelImage } from '../../../pixel-engine'
import { ABOUT_PHOTO_PIXEL } from '../../../pixel-engine/pixelConfig'
import image1 from '../../../assets/MyPhotos/image12.png'
import image2 from '../../../assets/MyPhotos/image11.png'
import image3 from '../../../assets/MyPhotos/image13.png'
import image4 from '../../../assets/MyPhotos/image14.png'
import image5 from '../../../assets/MyPhotos/image15.png'
import image6 from '../../../assets/MyPhotos/image16.png'
import image7 from '../../../assets/MyPhotos/image17.png'

export default function AboutMeWindowContent() {
  const { t } = useLanguage()
  const images = [image1, image2, image3, image4, image5, image6, image7]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageClick = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const currentSrc = images[currentImageIndex]

  return (
    <div className="about-window">
      <div className="about-window-body">
        <div className="about-photo-block" onClick={handleImageClick}>
          <div className="about-photo-wrap">
            <div className="about-photo-frame">
              <PixelImage
                src={currentSrc}
                className="about-photo"
                alt="profile"
                {...ABOUT_PHOTO_PIXEL}
              />
            </div>
            <div className="passport-stamp">{t.about.clickPhoto}</div>
          </div>
        </div>

        <div className="about-text">
          <div className="about-title">
            <h2 className="about-name">
              <span className="about-name-first">{t.about.nameFirst}</span>{' '}
              <span className="about-name-last">{t.about.nameLast}</span>
            </h2>
          </div>
          <div className="about-description">
            <p dangerouslySetInnerHTML={{ __html: t.about.desc1 }} />
            <p dangerouslySetInnerHTML={{ __html: t.about.desc2 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
