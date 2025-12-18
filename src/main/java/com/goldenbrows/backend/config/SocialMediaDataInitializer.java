package com.goldenbrows.backend.config;

import com.goldenbrows.backend.model.SocialMediaPost;
import com.goldenbrows.backend.repository.SocialMediaPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Order(3) // Run after other initializers
@RequiredArgsConstructor
public class SocialMediaDataInitializer implements CommandLineRunner {
    
    private final SocialMediaPostRepository repository;
    
    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return; // Already seeded
        }
        
        seedSamplePosts();
    }
    
    private void seedSamplePosts() {
        // Instagram Posts
        createPost(
            SocialMediaPost.Platform.INSTAGRAM,
            SocialMediaPost.PostType.IMAGE,
            "✨ Perfect brows for the perfect day! Book your appointment today! 💕 #GoldenBrows #Threading #BeautyGoals",
            "/images/social/instagram1.jpg",
            null,
            "https://www.instagram.com/p/example1/",
            245, 18, 0,
            LocalDateTime.now().minusDays(2)
        );
        
        createPost(
            SocialMediaPost.Platform.INSTAGRAM,
            SocialMediaPost.PostType.IMAGE,
            "Before & After magic! ✨ Transform your look with our expert brow threading. #BrowTransformation #BeautyStudio",
            "/images/social/instagram2.jpg",
            null,
            "https://www.instagram.com/p/example2/",
            312, 24, 0,
            LocalDateTime.now().minusDays(5)
        );
        
        createPost(
            SocialMediaPost.Platform.INSTAGRAM,
            SocialMediaPost.PostType.IMAGE,
            "New client special! 🎉 First visit gets 20% off all services! DM us to book. #NewClientSpecial #Threading",
            "/images/social/instagram3.jpg",
            null,
            "https://www.instagram.com/p/example3/",
            189, 31, 0,
            LocalDateTime.now().minusDays(7)
        );
        
        // Facebook Posts
        createPost(
            SocialMediaPost.Platform.FACEBOOK,
            SocialMediaPost.PostType.IMAGE,
            "Happy Friday everyone! 🌟 We're open until 7 PM today. Walk-ins welcome or book online at goldenbrowsthreading.com",
            "/images/social/facebook1.jpg",
            null,
            "https://www.facebook.com/goldenbrows/posts/example1",
            156, 12, 8,
            LocalDateTime.now().minusDays(1)
        );
        
        createPost(
            SocialMediaPost.Platform.FACEBOOK,
            SocialMediaPost.PostType.TEXT,
            "Thank you to all our amazing clients! 💖 Your support means the world to us. We're grateful to serve this wonderful community. Have a blessed week! 🙏",
            null,
            null,
            "https://www.facebook.com/goldenbrows/posts/example2",
            203, 28, 12,
            LocalDateTime.now().minusDays(4)
        );
        
        createPost(
            SocialMediaPost.Platform.FACEBOOK,
            SocialMediaPost.PostType.IMAGE,
            "SPECIAL OFFER: Brow lamination + tint combo for just $65! (Regular $70) Limited time only. Book now! 📞 (562) 832-1015",
            "/images/social/facebook2.jpg",
            null,
            "https://www.facebook.com/goldenbrows/posts/example3",
            287, 45, 23,
            LocalDateTime.now().minusDays(6)
        );
        
        // TikTok Posts (videos)
        createPost(
            SocialMediaPost.Platform.TIKTOK,
            SocialMediaPost.PostType.VIDEO,
            "Watch this amazing brow transformation! ✨ #browgoals #threading #satisfying",
            "https://www.tiktok.com/@goldenbrows/video/example1",
            "/images/social/tiktok1-thumb.jpg",
            "https://www.tiktok.com/@goldenbrows/video/example1",
            1542, 87, 234,
            LocalDateTime.now().minusDays(3)
        );
        
        createPost(
            SocialMediaPost.Platform.TIKTOK,
            SocialMediaPost.PostType.VIDEO,
            "POV: You just got your brows done at Golden Brows 💁‍♀️✨ #beforeandafter #browthreading",
            "https://www.tiktok.com/@goldenbrows/video/example2",
            "/images/social/tiktok2-thumb.jpg",
            "https://www.tiktok.com/@goldenbrows/video/example2",
            2103, 156, 412,
            LocalDateTime.now().minusDays(8)
        );
        
        System.out.println("✅ Social media posts seeded successfully!");
    }
    
    private void createPost(
            SocialMediaPost.Platform platform,
            SocialMediaPost.PostType postType,
            String caption,
            String mediaUrl,
            String thumbnailUrl,
            String postUrl,
            Integer likes,
            Integer comments,
            Integer shares,
            LocalDateTime publishedAt
    ) {
        SocialMediaPost post = SocialMediaPost.builder()
                .platform(platform)
                .postType(postType)
                .caption(caption)
                .mediaUrl(mediaUrl)
                .thumbnailUrl(thumbnailUrl)
                .postUrl(postUrl)
                .likes(likes)
                .comments(comments)
                .shares(shares)
                .publishedAt(publishedAt)
                .active(true)
                .build();
        
        repository.save(post);
    }
}