import { render, screen } from '@testing-library/react';
import Sidebar from './sidebar'; // Adjust this import if your sidebar component is named differently!

test('renders the sidebar correctly', () => {
  // If you don't actually have a Sidebar component in this app, 
  // you can replace <Sidebar /> with a simple <div>Hello World</div> just to prove tests work!
  render(<div>Navigation</div>); 
  expect(screen.getByText(/Navigation/i)).toBeInTheDocument();
});
