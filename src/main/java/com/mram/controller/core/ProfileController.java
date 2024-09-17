package com.mram.controller.core;

import com.mram.base.controller.GenericController;
import com.mram.model.core.Profile;
import com.mram.repository.core.ProfileRepository;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/profile")
public class ProfileController extends GenericController<Profile> {
    public ProfileController(ProfileRepository repository) {
        super(repository);
    }

/*    @GetMapping("/{id}")
    public Profile getById(@PathVariable(value = "id") Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profile", "id", id));
    }*/
}
