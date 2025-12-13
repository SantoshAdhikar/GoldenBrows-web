package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.BlogComment;
import com.goldenbrows.backend.model.BlogPost;
import com.goldenbrows.backend.repository.BlogCommentRepository;
import com.goldenbrows.backend.repository.BlogPostRepository;
import com.goldenbrows.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogPostRepository blogPostRepository;
    private final BlogCommentRepository commentRepository;
    private final NotificationService notificationService;

    // -------- DTO for comment requests --------
    public static class CommentRequest {
        private String authorName;
        private String content;

        public String getAuthorName() {
            return authorName;
        }
        public void setAuthorName(String authorName) {
            this.authorName = authorName;
        }
        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }
    }

    // ========= PUBLIC BLOG ENDPOINTS =========

    // List published posts (home/blog page)
    @GetMapping
    public List<BlogPost> listPublished() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }
    
    @GetMapping("/latest")
    public ResponseEntity<List<BlogPost>> getLatest() {
        List<BlogPost> latest = blogPostRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(latest);
    }

    // Get one published post by numeric id
    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getOne(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .filter(p -> Boolean.TRUE.equals(p.getPublished()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get one published post by slug, e.g. /api/blog/slug/why-threading-is-better
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPost> getBySlug(@PathVariable String slug) {
        return blogPostRepository.findBySlugAndPublishedTrue(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ========= ADMIN BLOG ENDPOINTS =========

    // Admin: list ALL posts (published + unpublished)
    // Full URL: GET /api/blog/admin
    @GetMapping("/admin")
    public List<BlogPost> getAllBlogPostsForAdmin() {
        // If you have a method like findAllByOrderByCreatedAtDesc(), you can use that instead
        return blogPostRepository.findAll();
    }

    // Admin: create a new blog post
    // Full URL: POST /api/blog
    @PostMapping
    public ResponseEntity<BlogPost> create(@RequestBody BlogPost request) {
        // generate slug if missing
        if (request.getSlug() == null || request.getSlug().isBlank()) {
            String slug = request.getTitle()
                    .toLowerCase()
                    .replaceAll("[^a-z0-9]+", "-")
                    .replaceAll("(^-|-$)", "");
            request.setSlug(slug);
        }

        // default: published = true if not specified
        if (request.getPublished() == null) {
            request.setPublished(Boolean.TRUE);
        }

        BlogPost saved = blogPostRepository.save(request);
        return ResponseEntity
                .created(URI.create("/api/blog/" + saved.getId()))
                .body(saved);
    }

    // Admin: update an existing blog post
    // Full URL: PUT /api/blog/{id}
    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> update(@PathVariable Long id,
                                           @RequestBody BlogPost request) {
        return blogPostRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(request.getTitle());

                    // only override slug if client sends something non-blank
                    if (request.getSlug() != null && !request.getSlug().isBlank()) {
                        existing.setSlug(request.getSlug());
                    }

                    existing.setExcerpt(request.getExcerpt());
                    existing.setContent(request.getContent());

                    if (request.getPublished() != null) {
                        existing.setPublished(request.getPublished());
                    }

                    BlogPost updated = blogPostRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: delete a post
    // Full URL: DELETE /api/blog/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!blogPostRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        blogPostRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Admin: explicitly set published / unpublished
    // PATCH /api/blog/{id}/publish?published=true|false
    @PatchMapping("/{id}/publish")
    public ResponseEntity<BlogPost> setPublished(@PathVariable Long id,
                                                 @RequestParam boolean published) {
        return blogPostRepository.findById(id)
                .map(existing -> {
                    existing.setPublished(published);
                    BlogPost saved = blogPostRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: toggle publish flag
    // PATCH /api/blog/{id}/toggle-publish
    @PatchMapping("/{id}/toggle-publish")
    public ResponseEntity<BlogPost> togglePublished(@PathVariable Long id) {
        return blogPostRepository.findById(id)
                .map(existing -> {
                    boolean current = Boolean.TRUE.equals(existing.getPublished());
                    existing.setPublished(!current);
                    BlogPost saved = blogPostRepository.save(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ========= COMMENTS (PUBLIC) =========

    // Get comments for a published post by slug
    // GET /api/blog/{slug}/comments
    @GetMapping("/{slug}/comments")
    public ResponseEntity<List<BlogComment>> getComments(@PathVariable String slug) {
        var postOpt = blogPostRepository.findBySlugAndPublishedTrue(slug);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var comments = commentRepository
                .findByPost_IdOrderByCreatedAtDesc(postOpt.get().getId());
        return ResponseEntity.ok(comments);
    }

    // Add a comment to a blog post
    // POST /api/blog/{slug}/comments
    @PostMapping("/{slug}/comments")
    public ResponseEntity<?> addComment(@PathVariable String slug,
                                        @RequestBody CommentRequest request) {
        if (request == null ||
                request.getAuthorName() == null || request.getAuthorName().isBlank() ||
                request.getContent() == null || request.getContent().isBlank()) {
            return ResponseEntity.badRequest().body("Name and comment are required");
        }

        var postOpt = blogPostRepository.findBySlugAndPublishedTrue(slug);
        if (postOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var comment = BlogComment.builder()
                .post(postOpt.get())
                .authorName(request.getAuthorName().trim())
                .content(request.getContent().trim())
                .createdAt(LocalDateTime.now())
                .build();

        var saved = commentRepository.save(comment);

        // this will safely do nothing if NotificationService is no-op
        notificationService.sendNewComment(saved);

        return ResponseEntity.ok(saved);
    }
}
