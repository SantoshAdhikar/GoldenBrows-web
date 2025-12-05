package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.BlogComment;
import com.goldenbrows.backend.repository.BlogCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/comments")
@RequiredArgsConstructor
public class CommentAdminController {

    private final BlogCommentRepository commentRepository;

    public record CommentAdminDto(
            Long id,
            String postTitle,
            String postSlug,
            String authorName,
            String content,
            LocalDateTime createdAt,
            String adminReply,
            LocalDateTime adminReplyAt
    ) {}

    public record ReplyRequest(String reply) {}

    @GetMapping
    public List<CommentAdminDto> listAll() {
        return commentRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(c -> new CommentAdminDto(
                        c.getId(),
                        c.getPost() != null ? c.getPost().getTitle() : null,
                        c.getPost() != null ? c.getPost().getSlug() : null,
                        c.getAuthorName(),
                        c.getContent(),
                        c.getCreatedAt(),
                        c.getAdminReply(),
                        c.getAdminReplyAt()
                ))
                .toList();
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<CommentAdminDto> reply(
            @PathVariable Long id,
            @RequestBody ReplyRequest request
    ) {
        return commentRepository.findById(id)
                .map(c -> {
                    c.setAdminReply(request.reply());
                    c.setAdminReplyAt(LocalDateTime.now());
                    BlogComment saved = commentRepository.save(c);

                    CommentAdminDto dto = new CommentAdminDto(
                            saved.getId(),
                            saved.getPost() != null ? saved.getPost().getTitle() : null,
                            saved.getPost() != null ? saved.getPost().getSlug() : null,
                            saved.getAuthorName(),
                            saved.getContent(),
                            saved.getCreatedAt(),
                            saved.getAdminReply(),
                            saved.getAdminReplyAt()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!commentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
