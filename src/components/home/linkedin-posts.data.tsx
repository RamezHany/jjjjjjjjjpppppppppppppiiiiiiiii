import type { LinkedinPost } from '@/interfaces/LinkedinPost'

let linkedinPosts: Array<LinkedinPost> = [];

// This function will be called to load the data
export async function loadLinkedinPostsData(): Promise<LinkedinPost[]> {
    try {
        const response = await fetch('https://raw.githubusercontent.com/RamezHany/IGCCe-tr/refs/heads/main/linkedin-posts.json');
        const data = await response.json();
        linkedinPosts = data.linkedinPosts;
        return linkedinPosts;
    } catch (error) {
        console.error('Error loading LinkedIn posts data:', error);
        return [];
    }
}

// Initial load of data
if (typeof window !== 'undefined') {
    loadLinkedinPostsData();
}

export { linkedinPosts };
