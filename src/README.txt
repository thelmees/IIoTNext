# Hosting a Website Using Git and Vercel

## Prerequisites
-------------------
- A GitHub account
- Node.js and npm installed
- A Vercel account

#######################################

## Step 1: Initialize a Git Repository
----------------------------------------
1. Navigate to your project folder.
2. Run the following command to initialize Git:
  
   git init

3. Add your project files to Git:

   git add .

4. Commit your changes:

   (git commit -m "Initial commit")

5. Create a new repository on GitHub.
6. Link your local project to the remote repository:

   (git remote add origin <your-repository-url>)

7. Push your code to the remote repository:

   (git push -u origin main)

###########################################

## Step 2: Deploy to Vercel
------------------------------
1. Install the Vercel CLI:

   (npm install -g vercel)

2. Login to Vercel:

   (vercel login)

3. Navigate to your project directory and deploy:

   (vercel)

4. Follow the interactive CLI steps to configure your project.
5. Once deployed, Vercel will provide a live URL for your website.

##################################################

## Step 3: Automatic Deployments with Git
-----------------------------------------------
1. Go to [Vercel Dashboard](https://vercel.com/).
2. Click **New Project** and select your Git repository.
3. Configure build settings (if necessary) and deploy.
4. Now, every push to the repository will trigger automatic deployments.

####################################################

## Step 4: Custom Domain (Optional)
--------------------------------------
1. In the Vercel Dashboard, go to your project settings.
2. Navigate to the **Domains** tab.
3. Add a custom domain and update DNS settings as required.
4. Verify and apply the changes.

####################################################

## Conclusion
Your website is now live and will automatically update on every push to the Git repository.

