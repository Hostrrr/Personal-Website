import React, { useState } from 'react'
import './AboutMeWindowContent.css'
import { useLanguage } from '../../../contexts/LanguageContext'

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

  return (
    <div className="about-window">
      <div className="about-photo-block" onClick={handleImageClick}>
        <img
          src={images[currentImageIndex]}
          className="about-photo"
          alt="profile"
        />

        <div className="passport-stamp">
          {t.about.clickPhoto}
        </div>
      </div>

      <div className="about-text">
        <div className="about-title">
          <h2 className="about-name">
            {t.about.name}
          </h2>
        </div>

        <div className="about-description">
          <p dangerouslySetInnerHTML={{ __html: t.about.desc1 }} />
          <p dangerouslySetInnerHTML={{ __html: t.about.desc2 }} />
        </div>
      </div>
    </div>
  )
}
