// AssetForm.test.jsx
import { render, fireEvent } from '@testing-library/react';
import AssetForm from '../components/AssetForm';

test('displays the correct title for new asset', () => {
  const { getByText } = render(<AssetForm onClose={() => {}} onSuccess={() => {}} />);
  expect(getByText(/Add Asset/i)).toBeInTheDocument();
});