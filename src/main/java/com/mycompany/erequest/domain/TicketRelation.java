package com.mycompany.erequest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TicketRelation.
 */
@Entity
@Table(name = "ticket_relation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TicketRelation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "related_ticket_id", nullable = false)
    private Long relatedTicketId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "steps", "dataLinks", "relations", "attachments", "slas", "comments" }, allowSetters = true)
    private Ticket ticket;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TicketRelation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRelatedTicketId() {
        return this.relatedTicketId;
    }

    public TicketRelation relatedTicketId(Long relatedTicketId) {
        this.setRelatedTicketId(relatedTicketId);
        return this;
    }

    public void setRelatedTicketId(Long relatedTicketId) {
        this.relatedTicketId = relatedTicketId;
    }

    public Ticket getTicket() {
        return this.ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public TicketRelation ticket(Ticket ticket) {
        this.setTicket(ticket);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TicketRelation)) {
            return false;
        }
        return getId() != null && getId().equals(((TicketRelation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TicketRelation{" +
            "id=" + getId() +
            ", relatedTicketId=" + getRelatedTicketId() +
            "}";
    }
}
