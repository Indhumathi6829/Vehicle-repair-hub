package com.vrh.controller;

import com.vrh.dto.ApiResponse;
import com.vrh.dto.ReviewRequest;
import com.vrh.dto.ReviewResponse;
import com.vrh.security.CustomUserDetails;
import com.vrh.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/api/customer/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ReviewResponse response = reviewService.addReview(request, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", response));
    }

    @GetMapping("/api/shops/{shopId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getShopReviews(@PathVariable Long shopId) {
        List<ReviewResponse> reviews = reviewService.getReviewsForShop(shopId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }
}
