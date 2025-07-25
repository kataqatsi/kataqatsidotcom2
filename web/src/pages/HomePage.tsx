import { UserForm } from '../components/UserForm';
import { Navbar } from '../components/Navbar';

export function HomePage() {
  const handleUserCreated = (user: any) => {
    console.log('User created:', user);
  };

  const handleError = (error: string) => {
    console.error('Error:', error);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="py-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Welcome to Kigri
            </h2>
            <p className="text-lg text-muted-foreground">
              Create and manage users with our simple interface
            </p>
          </div>

        </div>
      </div>
    </div>
  );
} 