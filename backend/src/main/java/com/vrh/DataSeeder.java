package com.vrh;

import com.vrh.entity.*;
import com.vrh.entity.enums.RepairStatus;
import com.vrh.entity.enums.Role;
import com.vrh.entity.enums.ShopStatus;
import com.vrh.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ServiceTypeRepository serviceTypeRepository;
    private final ShopOfferingRepository shopOfferingRepository;
    private final MechanicRepository mechanicRepository;
    private final VehicleRepository vehicleRepository;
    private final RepairRequestRepository repairRequestRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ShopRepository shopRepository,
                      ServiceTypeRepository serviceTypeRepository, ShopOfferingRepository shopOfferingRepository,
                      MechanicRepository mechanicRepository, VehicleRepository vehicleRepository,
                      RepairRequestRepository repairRequestRepository, ReviewRepository reviewRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.serviceTypeRepository = serviceTypeRepository;
        this.shopOfferingRepository = shopOfferingRepository;
        this.mechanicRepository = mechanicRepository;
        this.vehicleRepository = vehicleRepository;
        this.repairRequestRepository = repairRequestRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Users
        User admin = User.builder()
                .name("Platform Admin")
                .email("admin@vrh.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9999988888")
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);

        User owner1 = User.builder()
                .name("Sarah Connor")
                .email("owner1@vrh.com")
                .password(passwordEncoder.encode("owner123"))
                .phone("9876543210")
                .role(Role.SHOP_OWNER)
                .build();
        User owner2 = User.builder()
                .name("Tony Stark")
                .email("owner2@vrh.com")
                .password(passwordEncoder.encode("owner123"))
                .phone("8765432109")
                .role(Role.SHOP_OWNER)
                .build();
        userRepository.saveAll(Arrays.asList(owner1, owner2));

        User customer1 = User.builder()
                .name("Bruce Wayne")
                .email("customer1@vrh.com")
                .password(passwordEncoder.encode("customer123"))
                .phone("7654321098")
                .role(Role.CUSTOMER)
                .build();
        User customer2 = User.builder()
                .name("Peter Parker")
                .email("customer2@vrh.com")
                .password(passwordEncoder.encode("customer123"))
                .phone("6543210987")
                .role(Role.CUSTOMER)
                .build();
        userRepository.saveAll(Arrays.asList(customer1, customer2));

        // 2. Service Types catalog
        ServiceType s1 = ServiceType.builder()
                .name("Oil Change")
                .basePrice(new BigDecimal("500.00"))
                .description("Regular engine oil and filter replacement.")
                .build();
        ServiceType s2 = ServiceType.builder()
                .name("Brake Service")
                .basePrice(new BigDecimal("1200.00"))
                .description("Complete brake pads inspection and replacement.")
                .build();
        ServiceType s3 = ServiceType.builder()
                .name("Engine Diagnostic")
                .basePrice(new BigDecimal("2500.00"))
                .description("Full computer scan diagnostics.")
                .build();
        ServiceType s4 = ServiceType.builder()
                .name("Tyre Rotation & Alignment")
                .basePrice(new BigDecimal("800.00"))
                .description("4-wheel alignment, balancing, and rotation.")
                .build();
        ServiceType s5 = ServiceType.builder()
                .name("Battery Replacement")
                .basePrice(new BigDecimal("3000.00"))
                .description("New 12V automotive battery installation.")
                .build();
        serviceTypeRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5));

        // 3. Shops
        Shop shop1 = Shop.builder()
                .name("AutoPro Care Center")
                .address("123 Mount Road, T-Nagar")
                .city("Chennai")
                .owner(owner1)
                .status(ShopStatus.APPROVED)
                .avgRating(5.0)
                .shopServices(new ArrayList<>())
                .build();
        Shop shop2 = Shop.builder()
                .name("Stark QuickFix Garage")
                .address("456 MG Road, Indiranagar")
                .city("Bangalore")
                .owner(owner2)
                .status(ShopStatus.APPROVED)
                .avgRating(0.0)
                .shopServices(new ArrayList<>())
                .build();
        shopRepository.saveAll(Arrays.asList(shop1, shop2));

        // 4. Shop Offerings (which services each shop offers)
        ShopOffering so1 = ShopOffering.builder().shop(shop1).serviceType(s1).build();
        ShopOffering so2 = ShopOffering.builder().shop(shop1).serviceType(s2).build();
        ShopOffering so3 = ShopOffering.builder().shop(shop1).serviceType(s3).build();
        shopOfferingRepository.saveAll(Arrays.asList(so1, so2, so3));

        ShopOffering so4 = ShopOffering.builder().shop(shop2).serviceType(s1).build();
        ShopOffering so5 = ShopOffering.builder().shop(shop2).serviceType(s4).build();
        ShopOffering so6 = ShopOffering.builder().shop(shop2).serviceType(s5).build();
        shopOfferingRepository.saveAll(Arrays.asList(so4, so5, so6));

        shop1.getShopServices().addAll(Arrays.asList(so1, so2, so3));
        shop2.getShopServices().addAll(Arrays.asList(so4, so5, so6));
        shopRepository.saveAll(Arrays.asList(shop1, shop2));

        // 5. Mechanics
        User mechUser1 = User.builder()
                .name("John Doe")
                .email("john@vrh.com")
                .password(passwordEncoder.encode("mechanic123"))
                .phone("9876500001")
                .role(Role.MECHANIC)
                .build();
        User mechUser2 = User.builder()
                .name("Jane Smith")
                .email("jane@vrh.com")
                .password(passwordEncoder.encode("mechanic123"))
                .phone("9876500002")
                .role(Role.MECHANIC)
                .build();
        User mechUser3 = User.builder()
                .name("Bob Johnson")
                .email("bob@vrh.com")
                .password(passwordEncoder.encode("mechanic123"))
                .phone("9876500003")
                .role(Role.MECHANIC)
                .build();
        userRepository.saveAll(Arrays.asList(mechUser1, mechUser2, mechUser3));

        Mechanic mech1 = Mechanic.builder().user(mechUser1).shop(shop1).specialization("Engine Tuning").isAvailable(true).build();
        Mechanic mech2 = Mechanic.builder().user(mechUser2).shop(shop1).specialization("Brake Overhauls").isAvailable(true).build();
        Mechanic mech3 = Mechanic.builder().user(mechUser3).shop(shop2).specialization("Tyres & Electricals").isAvailable(true).build();
        mechanicRepository.saveAll(Arrays.asList(mech1, mech2, mech3));

        // 6. Customer Vehicles
        Vehicle vCar1 = Vehicle.builder().customer(customer1).type("Car").brand("Tesla").model("Model 3").regNumber("KA-51-MJ-1111").build();
        Vehicle vCar2 = Vehicle.builder().customer(customer2).type("Car").brand("Honda").model("Civic").regNumber("TN-02-AB-5678").build();
        vehicleRepository.saveAll(Arrays.asList(vCar1, vCar2));

        // 7. Sample Repair Requests
        RepairRequest req1 = RepairRequest.builder()
                .customer(customer1)
                .vehicle(vCar1)
                .shop(shop1)
                .serviceType(s1)
                .issueDescription("Engine noise slightly louder than usual.")
                .status(RepairStatus.REQUESTED)
                .cost(s1.getBasePrice())
                .build();
        repairRequestRepository.save(req1);

        RepairRequest req2 = RepairRequest.builder()
                .customer(customer2)
                .vehicle(vCar2)
                .shop(shop1)
                .serviceType(s2)
                .issueDescription("Brakes squeaking when stopping.")
                .status(RepairStatus.COMPLETED)
                .cost(s2.getBasePrice())
                .mechanic(mech2)
                .completedAt(LocalDateTime.now().minusDays(1))
                .build();
        repairRequestRepository.save(req2);

        // 8. Review on the completed request
        Review rev = Review.builder()
                .repairRequest(req2)
                .customer(customer2)
                .rating(5)
                .comment("Excellent brake replacement service! Mechanic Jane was very professional.")
                .build();
        reviewRepository.save(rev);

        shop1.setAvgRating(5.0);
        shopRepository.save(shop1);
    }
}
