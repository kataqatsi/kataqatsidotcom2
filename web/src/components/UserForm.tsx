import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CreateUserRequestDto, type UserResponseDto, type UserDataDto } from '../lib/models/Schemas';
import { backendApi } from '../lib/models/Base';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

interface UserFormProps {
  onSuccess?: (user: UserDataDto) => void;
  onError?: (error: string) => void;
}

export function UserForm({ onSuccess, onError }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const form = useForm<CreateUserRequestDto>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      age: 0,
    },
  });

  const onSubmit = async (data: CreateUserRequestDto) => {
    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', data);
      const response = await backendApi<CreateUserRequestDto, UserResponseDto>('POST', '/user', false, data);
      console.log('Successfully created user:', response);
      
      if (response && response.success && response.data) {
        // Show success message
        setSuccessMessage(`User "${response.data.name}" created successfully!`);
        onSuccess?.(response.data);
        
        // Reset form
        form.reset();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else if (response && response.error) {
        onError?.(response.error.message);
      } else {
        onError?.('An unexpected error occurred');
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error?.data?.error?.message) {
        onError?.(error.data.error.message);
      } else if (error?.message) {
        onError?.(error.message);
      } else {
        onError?.('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{
              required: 'Name is required',
              minLength: { value: 1, message: 'Name must not be empty' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: 'Password is required',
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            rules={{
              required: 'Age is required',
              min: { value: 0, message: 'Age must be a positive number' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter age" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 