package com.fwn.foodwaste.service;

import com.fwn.foodwaste.entity.Role;
import com.fwn.foodwaste.entity.User;
import com.fwn.foodwaste.entity.enums.RoleName;
import com.fwn.foodwaste.repository.RoleRepository;
import com.fwn.foodwaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;



    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + id));
    }



    /**
     * Replaces all current roles on the user with the supplied set.
     * Roles must be valid RoleName strings e.g. "ROLE_ADMIN".
     */
    public User assignRoles(Long id, Set<String> roleNames) {
        User user = findById(id);

        Set<Role> roles = roleNames.stream()
                .map(name -> roleRepository
                        .findByRole(RoleName.valueOf(name))
                        .orElseThrow(() -> new IllegalArgumentException(
                                "Role not found: " + name)))
                .collect(Collectors.toSet());

        user.setRoles(roles);
        return userRepository.save(user);
    }



    public User setActiveStatus(Long id, boolean active) {
        User user = findById(id);
        user.setActive(active);
        return userRepository.save(user);
    }



    public void delete(Long id) {
        if (!userRepository.existsById(id))
            throw new IllegalArgumentException("User not found: " + id);
        userRepository.deleteById(id);
    }
}
