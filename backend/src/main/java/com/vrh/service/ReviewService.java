package com.vrh.service;

import com.vrh.dto.ReviewRequest;
import com.vrh.dto.ReviewResponse;
import com.vrh.entity.RepairRequest;
import com.vrh.entity.Review;
import com.vrh.entity.Shop;
import com.vrh.entity.User;
import com.vrh.entity.enums.RepairStatus;
import com.vrh.exception.BadRequestException;
import com.vrh.exception.ResourceNotFoundException;
import com.vrh.repository.RepairRequestRepository;
import com.vrh.repository.ReviewRepository;
import com.vrh.repository.ShopRepository;
import com.vrh.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final UserRepository userRepository;
    private final ShopRepository shopRepository;

    public ReviewService(ReviewRepository reviewRepository, RepairRequestRepository repairRequestRepository,
                         UserRepository userRepository, ShopRepository shopRepository) {
        this.reviewRepository = reviewRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
    }

    @Transactional
    public ReviewResponse addReview(ReviewRequest request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        RepairRequest repairRequest = repairRequestRepository.findById(request.getRepairRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Repair request not found"));

        // Verify customer owns the repair request
        if (!repairRequest.getCustomer().getId().equals(customerId)) {
            throw new BadRequestException("You can only review your own repair requests");
        }

        // FR-8: Reviews can only be submitted for repair requests with status COMPLETED
        if (repairRequest.getStatus() != RepairStatus.COMPLETED) {
            throw new BadRequestException("You can only leave reviews for completed repair requests");
        }

        // Check if already reviewed
        if (reviewRepository.findByRepairRequestId(request.getRepairRequestId()).isPresent()) {
            throw new BadRequestException("You have already reviewed this repair request");
        }

        Review review = Review.builder()
                .repairRequest(repairRequest)
                .customer(customer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Recompute average rating for the shop
        Shop shop = repairRequest.getShop();
        Double avgRating = reviewRepository.getAverageRatingForShop(shop.getId());
        shop.setAvgRating(avgRating != null ? avgRating : 0.0);
        shopRepository.save(shop);

        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsForShop(Long shopId) {
        return reviewRepository.findByRepairRequestShopId(shopId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .repairRequestId(review.getRepairRequest().getId())
                .customerId(review.getCustomer().getId())
                .customerName(review.getCustomer().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
