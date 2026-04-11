package com.mycompany.erequest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TicketSLA.
 */
@Entity
@Table(name = "ticket_sla")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TicketSLA implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "deadline", nullable = false)
    private Instant deadline;

    @Column(name = "remind_at")
    private Instant remindAt;

    @JsonIgnoreProperties(value = { "sla", "ticket" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "sla")
    private TicketStep step;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "steps", "dataLinks", "relations", "attachments", "slas", "comments" }, allowSetters = true)
    private Ticket ticket;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TicketSLA id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDeadline() {
        return this.deadline;
    }

    public TicketSLA deadline(Instant deadline) {
        this.setDeadline(deadline);
        return this;
    }

    public void setDeadline(Instant deadline) {
        this.deadline = deadline;
    }

    public Instant getRemindAt() {
        return this.remindAt;
    }

    public TicketSLA remindAt(Instant remindAt) {
        this.setRemindAt(remindAt);
        return this;
    }

    public void setRemindAt(Instant remindAt) {
        this.remindAt = remindAt;
    }

    public TicketStep getStep() {
        return this.step;
    }

    public void setStep(TicketStep ticketStep) {
        if (this.step != null) {
            this.step.setSla(null);
        }
        if (ticketStep != null) {
            ticketStep.setSla(this);
        }
        this.step = ticketStep;
    }

    public TicketSLA step(TicketStep ticketStep) {
        this.setStep(ticketStep);
        return this;
    }

    public Ticket getTicket() {
        return this.ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public TicketSLA ticket(Ticket ticket) {
        this.setTicket(ticket);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TicketSLA)) {
            return false;
        }
        return getId() != null && getId().equals(((TicketSLA) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TicketSLA{" +
            "id=" + getId() +
            ", deadline='" + getDeadline() + "'" +
            ", remindAt='" + getRemindAt() + "'" +
            "}";
    }
}
