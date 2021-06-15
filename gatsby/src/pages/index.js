import * as React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

const IndexPage = () => {
  return (
    <main className="font-serif text-white sm:block lg:grid">
      <StaticImage
        style={{
          gridArea: '1/1',
          maxHeight: '90vh',
          // height: '100vh',
        }}
        layout='fullWidth'
        alt=''
        src='../../data/gallery/_DSC4949.jpg'
      />
      <div className='relative' style={{gridArea: '1/1'}}>
        <div
          className="lg:inline-block sm:relative lg:absolute m-2 flex flex-col items-end"
          style={{
            right: 0,
          }}
        >
          <section className='bg-black rounded-xl py-6'>
            <div className="mx-auto px-6">
              <h1 className="italic font-normal text-5xl text-pink-500">Chuck Dries</h1>
              <h2 className="italic text-blue-300 text-2xl">Full stack software engineer &amp; hobbyist photographer</h2>
              <ul>
                <li>Software Developer, <span className="text-gray-300 italic">Axosoft</span></li>
                <li><a className="hover:text-pink-400 underline" href="mailto:chuck@chuckdries.com">chuck@chuckdries.com</a> / <span>602.618.0414</span></li>
                <li>
                  <a className="mr-1 hover:text-pink-400 underline" href="http://github.com/chuckdries">Github</a>/
                  <a className="mx-1 hover:text-pink-400 underline" href="https://www.linkedin.com/in/chuckdries/">LinkedIn</a>/
                  <a className="mx-1 hover:text-pink-400 underline" href="https://devpost.com/chuckdries">Devpost</a>/
                  <a className="mx-1 hover:text-pink-400 underline" href="CharlesDriesResumeCurrent.pdf">Resume [pdf]</a>/
                  <a className="mx-1 hover:text-pink-400 underline" href="https://medium.com/@chuckdries">Medium (blog)</a>
                  {/* <a href="https://pgp.mit.edu/pks/lookup?op=get&search=0x2BD9D0871DB5A518">Public Key</a> */}
                </li>
              </ul>
            </div>
          </section>
          <Link className='text-black hover:underline font-sans inline-block p-3 my-2 rounded-md bg-gray-300 border-2 arrow-after font-bold border-gray-400' to='/photogallery'>
            Photography</Link>
        </div>
      </div>
    </main>
  );
};

export default IndexPage;
