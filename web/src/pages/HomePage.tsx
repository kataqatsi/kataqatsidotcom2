import { Navbar } from '../components/Navbar';

export function HomePage() {


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="py-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Sinewax
            </h2>
            <p className="text-lg text-muted-foreground">
              Build your product
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 