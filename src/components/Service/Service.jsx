import React from 'react'
import SubHeader from '../Shared/SubHeader'
import Footer from '../Shared/Footer/Footer'
import Header from '../Shared/Header/Header'
import img from '../../images/features/baby.png'
import { Link } from 'react-router-dom'
import doctorBg from '../../images/img/doctors-bg.jpg';

const Service = () => {
  const weArePleaseStyle = {
    backgroundColor: "antiquewhite",
    height: "60vh",
    background: `url(${doctorBg}) no-repeat`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    padding: "10px",
    position: "relative",
    marginTop: 200,
    marginBottom: 100
  }
  const services = [
    {
      title: "General Medicine",
      description: "Comprehensive health checkups, vaccinations, and preventive care for common ailments.",
      image: "../../images/features/feature-02.jpg"
    },
    {
      title: "Cardiology",
      description: "Expert heart care including ECG, Stress Tests, and specialized cardiac consultations.",
      image: "../../images/features/feature-01.jpg"
    },
    {
      title: "Ayurveda & Wellness",
      description: "Authentic traditional Indian healing, detoxification, and holistic wellness programs.",
      image: "../../images/features/feature-05.jpg"
    },
    {
      title: "Maternity & Gynaecology",
      description: "Expert care for women's health, from prenatal checkups to post-natal support.",
      image: "../../images/features/feature-03.jpg"
    },
    {
      title: "Pediatric Care",
      description: "Quality healthcare for infants and children with specialized pediatricians.",
      image: "../../images/features/baby.png"
    },
    {
      title: "Telemedicine",
      description: "Connect with top Indian doctors instantly through 24/7 video consultations.",
      image: "../../images/features/feature-06.jpg"
    }
  ];

  return (
    <>
      <Header />
      <SubHeader title="Our Services" subtitle="World-class healthcare services tailored for India." />

      <div className="container" style={{ marginTop: 150, marginBottom: 100 }}>
        <div className="row">
          {
            services.map((service, id) => (
              <div className="col-lg-4 col-md-6 col-sm-6" key={id}>
                <div className="card shadow border-0 mb-5 service-content-card-ui">
                  <div className="p-4">
                    <h4 className="mt-2 mb-3 text-primary">{service.title}</h4>
                    <p className="text-muted mb-4">{service.description}</p>
                    <Link to="/doctors" className="btn btn-outline-primary btn-sm">Find Doctors</Link>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <section style={weArePleaseStyle}>
        <div className="container" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="row">
            <div className="col-lg-7">
              <div className="d-flex align-items-center">
                <div className='mb-4 section-title text-center'>
                  <h2 className='text-uppercase'>We are pleased to offer you the</h2>
                  <p className='form-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sed.</p>
                  <Link to={'/doctors'} className="btn-get-started scrollto">Get Started</Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Service