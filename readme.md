# chuckdries.com

[![Build Status](https://drone.chuckdries.com/api/badges/chuckdries/Personal-Website/status.svg)](https://drone.chuckdries.com/chuckdries/Personal-Website)

My personal website. Built with 
- gatsby
- tailwind
- node-vibrant

and a totally from-scratch masonry gallery component that I will write a blog post about some day.

I use node-vibrant in the gatsby OnCreateNode hook to pull colors from the images and store them in the gatsby node structure. I query them in the client, then assign CSS custom properties with react-helmet. In my tailwind config, I define custom colors that use those properties. This gets me classes like `text-vibrant-light` that change colors to vibe with the selected image