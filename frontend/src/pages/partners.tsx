import partner01 from '../assets/partner_01.png';
import partner02 from '../assets/partner_02.png';
import partner04 from '../assets/partner_04.png';
import partner05 from '../assets/partner_05.png';
import partner06 from '../assets/partner_06.png';
import partner07 from '../assets/partner_07.png';
import partner08 from '../assets/partner_08.png';
import partner09 from '../assets/partner_09.png';
import partner10 from '../assets/partner_10.png';

const partnerLogos = [
  { src: partner01, alt: 'Partner 01' },
  { src: partner02, alt: 'Partner 02' },
  { src: partner04, alt: 'Partner 04' },
  { src: partner05, alt: 'Partner 05' },
  { src: partner06, alt: 'Partner 06' },
  { src: partner07, alt: 'Partner 07' },
  { src: partner08, alt: 'Partner 08' },
  { src: partner09, alt: 'Partner 09' },
  { src: partner10, alt: 'Partner 10' },
];

const PartnersPage = () => {
  return (
    <section className="content-section partners-section" id="partners">
      <div className="section-heading">
        <span className="eyebrow eyebrow-soft">Partners</span>
        <h2>Trusted by organisations building the future.</h2>
      </div>

      <div className="partners-marquee" aria-label="Our partner organisations">
        <div className="partners-track">
          <div className="partners-group">
            {partnerLogos.map(({ src, alt }) => (
              <div className="partner-card" key={alt}>
                <img src={src} alt={alt} />
              </div>
            ))}
          </div>
          <div className="partners-group" aria-hidden="true">
            {partnerLogos.map(({ src, alt }) => (
              <div className="partner-card" key={alt}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersPage;
