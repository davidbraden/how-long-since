# How long since Deployment Guide (GCP)

Here is a complete, step-by-step guide with all the `gcloud` commands you will need to deploy this application to Google Cloud Storage and set up a CI/CD pipeline with Cloud Build.

---

### **Prerequisites**

1.  **Install `gcloud`:** Make sure you have the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) installed.
2.  **Log in:** Authenticate your session by running `gcloud auth login`.

---

### **Step 1: Create and Configure a New GCP Project**

First, you need a new project to house your resources.

1.  **Choose a unique Project ID.** This ID must be globally unique. Replace `how-long-since-your-unique-id` with your choice.
    ```bash
    export PROJECT_ID="how-long-since-your-unique-id"
    ```

2.  **Create the new project:**
    ```bash
    gcloud projects create $PROJECT_ID
    ```

3.  **Set `gcloud` to use your new project:**
    ```bash
    gcloud config set project $PROJECT_ID
    ```

4.  **Link a billing account.** You need to find your Billing Account ID first.
    *   List your available billing accounts:
        ```bash
        gcloud beta billing accounts list
        ```
    *   Copy your `ACCOUNT_ID` from the output and use it in the command below:
        ```bash
        gcloud beta billing projects link $PROJECT_ID --billing-account="YOUR_BILLING_ACCOUNT_ID"
        ```

5.  **Enable the necessary APIs:** This allows your project to use Cloud Storage, Cloud Build, and Cloud Source Repositories.
    ```bash
    gcloud services enable storage.googleapis.com \
        cloudbuild.googleapis.com \
        cloudresourcemanager.googleapis.com
    ```

### **Step 2: Create and Configure the GCS Bucket**

This bucket will store your website's files. Bucket names must be globally unique, so using your Project ID is a safe bet.

1.  **Create the GCS bucket.** I'm using `US-CENTRAL1` as a default location, but you can choose any region.
    ```bash
    gcloud storage buckets create gs://$PROJECT_ID --location=europe-west1
    ```

2.  **Configure the bucket to serve a static website:**
    ```bash
    gcloud storage buckets update gs://$PROJECT_ID --web-main-page-suffix=index.html
    ```

3.  **Make the bucket's contents publicly readable.** This is what allows anyone on the internet to view your website.
    ```bash
    gcloud storage buckets add-iam-policy-binding gs://$PROJECT_ID --member=allUsers --role=roles/storage.objectViewer
    ```

### **Step 3: Create the Build Configuration**

Cloud Build needs a file to tell it what to do.

1.  **Create a `cloudbuild.yaml` file** in the root of your project directory with the following content. This file instructs Cloud Build to copy all your files into the GCS bucket you just created.

    ```yaml
    steps:
      - name: 'gcr.io/cloud-builders/gsutil'
        args: ['-m', 'rsync', '-r', '.', 'gs://<YOUR_PROJECT_ID>']
    ```
    **Important:** Replace `<YOUR_PROJECT_ID>` in the file above with the actual Project ID you chose in Step 1.

2.  **Add and commit `cloudbuild.yaml`** to your local Git repository:
    ```bash
    git add cloudbuild.yaml
    git commit -m "ci: Add Cloud Build configuration"
    ```

### **Step 4: Set Up the Git Repository and Cloud Build Trigger**

This final step connects your local Git repository to Google Cloud and creates the trigger that automates deployments.

1.  **Create a new Cloud Source Repository** to mirror your local Git repo:
    ```bash
    gcloud source repos create how-long-since
    ```

2.  **Add the new repository as a remote** for your local project:
    ```bash
    git remote add google https://source.developers.google.com/p/$PROJECT_ID/r/how-long-since
    ```

3.  **Create the Cloud Build trigger.** This trigger will watch the `master` branch and run your `cloudbuild.yaml` file whenever you push a change.
    ```bash
    gcloud beta builds triggers create cloud-source-repositories \
      --name="deploy-on-push" \
      --repo="how-long-since" \
      --branch-pattern="master" \
      --build-config="cloudbuild.yaml"
    ```

### **Final Step: Deploy!**

You are now fully configured. To trigger your first deployment and every deployment after, simply push your local Git repository to the new `google` remote:

```bash
git push --all google
```

After the build finishes (it will be very fast), your website will be live at:

**`https://storage.googleapis.com/YOUR_PROJECT_ID/index.html`**

