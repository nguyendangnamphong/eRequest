package com.mycompany.erequest.repository;

import com.mycompany.erequest.domain.TicketAttachment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TicketAttachment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {}
