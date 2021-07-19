# chuckdries.com

![screenshot of website](static/screenshot-1.png)

My personal website.  
- gatsby
- tailwind
- node-vibrant
- react-helmet

![screenshot of website](static/screenshot-2.png)

I use node-vibrant in the gatsby OnCreateNode hook to pull colors from the images and store them in the gatsby node structure. I query them in the client, then assign CSS custom properties with react-helmet. In my tailwind config, I define custom colors that use those properties. This gets me classes like `text-vibrant-light` that change colors to vibe with the selected image