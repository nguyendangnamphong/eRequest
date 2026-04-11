package com.mycompany.erequest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TicketStep.
 */
@Entity
@Table(name = "ticket_step")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TicketStep implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "node_id", nullable = false)
    private Long nodeId;

    @NotNull
    @Column(name = "performer_email", nullable = false)
    private String performerEmail;

    @NotNull
    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "finished_at")
    private Instant finishedAt;

    @JsonIgnoreProperties(value = { "step", "ticket" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private TicketSLA sla;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "steps", "dataLinks", "relations", "attachments", "slas", "comments" }, allowSetters = true)
    private Ticket ticket;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TicketStep id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getNodeId() {
        return this.nodeId;
    }

    public TicketStep nodeId(Long nodeId) {
        this.setNodeId(nodeId);
        return this;
    }

    public void setNodeId(Long nodeId) {
        this.nodeId = nodeId;
    }

    public String getPerformerEmail() {
        return this.performerEmail;
    }

    public TicketStep performerEmail(String performerEmail) {
        this.setPerformerEmail(performerEmail);
        return this;
    }

    public void setPerformerEmail(String performerEmail) {
        this.performerEmail = performerEmail;
    }

    public Integer getStatus() {
        return this.status;
    }

    public TicketStep status(Integer status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Instant getStartedAt() {
        return this.startedAt;
    }

    public TicketStep startedAt(Instant startedAt) {
        this.setStartedAt(startedAt);
        return this;
    }

    public void setStartedAt(Instant startedAt) {
        this.startedAt = startedAt;
    }

    public Instant getFinishedAt() {
        return this.finishedAt;
    }

    public TicketStep finishedAt(Instant finishedAt) {
        this.setFinishedAt(finishedAt);
        return this;
    }

    public void setFinishedAt(Instant finishedAt) {
        this.finishedAt = finishedAt;
    }

    public TicketSLA getSla() {
        return this.sla;
    }

    public void setSla(TicketSLA ticketSLA) {
        this.sla = ticketSLA;
    }

    public TicketStep sla(TicketSLA ticketSLA) {
        this.setSla(ticketSLA);
        return this;
    }

    public Ticket getTicket() {
        return this.ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public TicketStep ticket(Ticket ticket) {
        this.setTicket(ticket);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TicketStep)) {
            return false;
        }
        return getId() != null && getId().equals(((TicketStep) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TicketStep{" +
            "id=" + getId() +
            ", nodeId=" + getNodeId() +
            ", performerEmail='" + getPerformerEmail() + "'" +
            ", status=" + getStatus() +
            ", startedAt='" + getStartedAt() + "'" +
            ", finishedAt='" + getFinishedAt() + "'" +
            "}";
    }
}
