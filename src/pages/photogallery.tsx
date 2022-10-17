import { navigate } from 'gatsby';
import React, { useEffect } from 'react';

export default function RedirectGallery() {
  useEffect(() => {
    navigate('/');
  }, []);
  return null;

}