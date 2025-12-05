package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.BlogComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {

    List<BlogComment> findByPost_IdOrderByCreatedAtDesc(Long postId);
    List<BlogComment> findAllByOrderByCreatedAtDesc();

}
