import { NextPage } from 'next';
import Layout from '../components/layout/Layout';
import MRCFetcher from '../components/MRCFetcher/MRCFetcher';

const MRCsPage: NextPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold text-white mb-4">
                Morpheus Request for Comments
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore MRCs that shape the future of the Morpheus ecosystem. 
                View proposals, track implementation status, and stay updated with the latest developments.
              </p>
            </div>
            
            <MRCFetcher />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MRCsPage;