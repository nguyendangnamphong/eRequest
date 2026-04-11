package com.mycompany.erequest.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Ticket.
 */
@Entity
@Table(name = "ticket")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Ticket implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "flow_id", nullable = false)
    private Long flowId;

    @NotNull
    @Column(name = "ticket_name", nullable = false)
    private String ticketName;

    @NotNull
    @Column(name = "creator_email", nullable = false)
    private String creatorEmail;

    @Column(name = "current_step_id")
    private Long currentStepId;

    @NotNull
    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "priority")
    private Integer priority;

    @NotNull
    @Column(name = "version", nullable = false)
    private Integer version;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "sla", "ticket" }, allowSetters = true)
    private Set<TicketStep> steps = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ticket" }, allowSetters = true)
    private Set<TicketDataLink> dataLinks = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ticket" }, allowSetters = true)
    private Set<TicketRelation> relations = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ticket" }, allowSetters = true)
    private Set<TicketAttachment> attachments = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "step", "ticket" }, allowSetters = true)
    private Set<TicketSLA> slas = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "ticket")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "ticket" }, allowSetters = true)
    private Set<TicketComment> comments = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Ticket id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFlowId() {
        return this.flowId;
    }

    public Ticket flowId(Long flowId) {
        this.setFlowId(flowId);
        return this;
    }

    public void setFlowId(Long flowId) {
        this.flowId = flowId;
    }

    public String getTicketName() {
        return this.ticketName;
    }

    public Ticket ticketName(String ticketName) {
        this.setTicketName(ticketName);
        return this;
    }

    public void setTicketName(String ticketName) {
        this.ticketName = ticketName;
    }

    public String getCreatorEmail() {
        return this.creatorEmail;
    }

    public Ticket creatorEmail(String creatorEmail) {
        this.setCreatorEmail(creatorEmail);
        return this;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public Long getCurrentStepId() {
        return this.currentStepId;
    }

    public Ticket currentStepId(Long currentStepId) {
        this.setCurrentStepId(currentStepId);
        return this;
    }

    public void setCurrentStepId(Long currentStepId) {
        this.currentStepId = currentStepId;
    }

    public Integer getStatus() {
        return this.status;
    }

    public Ticket status(Integer status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getPriority() {
        return this.priority;
    }

    public Ticket priority(Integer priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getVersion() {
        return this.version;
    }

    public Ticket version(Integer version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
    }

    public Ticket createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return this.updatedAt;
    }

    public Ticket updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getCompletedAt() {
        return this.completedAt;
    }

    public Ticket completedAt(Instant completedAt) {
        this.setCompletedAt(completedAt);
        return this;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Set<TicketStep> getSteps() {
        return this.steps;
    }

    public void setSteps(Set<TicketStep> ticketSteps) {
        if (this.steps != null) {
            this.steps.forEach(i -> i.setTicket(null));
        }
        if (ticketSteps != null) {
            ticketSteps.forEach(i -> i.setTicket(this));
        }
        this.steps = ticketSteps;
    }

    public Ticket steps(Set<TicketStep> ticketSteps) {
        this.setSteps(ticketSteps);
        return this;
    }

    public Ticket addSteps(TicketStep ticketStep) {
        this.steps.add(ticketStep);
        ticketStep.setTicket(this);
        return this;
    }

    public Ticket removeSteps(TicketStep ticketStep) {
        this.steps.remove(ticketStep);
        ticketStep.setTicket(null);
        return this;
    }

    public Set<TicketDataLink> getDataLinks() {
        return this.dataLinks;
    }

    public void setDataLinks(Set<TicketDataLink> ticketDataLinks) {
        if (this.dataLinks != null) {
            this.dataLinks.forEach(i -> i.setTicket(null));
        }
        if (ticketDataLinks != null) {
            ticketDataLinks.forEach(i -> i.setTicket(this));
        }
        this.dataLinks = ticketDataLinks;
    }

    public Ticket dataLinks(Set<TicketDataLink> ticketDataLinks) {
        this.setDataLinks(ticketDataLinks);
        return this;
    }

    public Ticket addDataLinks(TicketDataLink ticketDataLink) {
        this.dataLinks.add(ticketDataLink);
        ticketDataLink.setTicket(this);
        return this;
    }

    public Ticket removeDataLinks(TicketDataLink ticketDataLink) {
        this.dataLinks.remove(ticketDataLink);
        ticketDataLink.setTicket(null);
        return this;
    }

    public Set<TicketRelation> getRelations() {
        return this.relations;
    }

    public void setRelations(Set<TicketRelation> ticketRelations) {
        if (this.relations != null) {
            this.relations.forEach(i -> i.setTicket(null));
        }
        if (ticketRelations != null) {
            ticketRelations.forEach(i -> i.setTicket(this));
        }
        this.relations = ticketRelations;
    }

    public Ticket relations(Set<TicketRelation> ticketRelations) {
        this.setRelations(ticketRelations);
        return this;
    }

    public Ticket addRelations(TicketRelation ticketRelation) {
        this.relations.add(ticketRelation);
        ticketRelation.setTicket(this);
        return this;
    }

    public Ticket removeRelations(TicketRelation ticketRelation) {
        this.relations.remove(ticketRelation);
        ticketRelation.setTicket(null);
        return this;
    }

    public Set<TicketAttachment> getAttachments() {
        return this.attachments;
    }

    public void setAttachments(Set<TicketAttachment> ticketAttachments) {
        if (this.attachments != null) {
            this.attachments.forEach(i -> i.setTicket(null));
        }
        if (ticketAttachments != null) {
            ticketAttachments.forEach(i -> i.setTicket(this));
        }
        this.attachments = ticketAttachments;
    }

    public Ticket attachments(Set<TicketAttachment> ticketAttachments) {
        this.setAttachments(ticketAttachments);
        return this;
    }

    public Ticket addAttachments(TicketAttachment ticketAttachment) {
        this.attachments.add(ticketAttachment);
        ticketAttachment.setTicket(this);
        return this;
    }

    public Ticket removeAttachments(TicketAttachment ticketAttachment) {
        this.attachments.remove(ticketAttachment);
        ticketAttachment.setTicket(null);
        return this;
    }

    public Set<TicketSLA> getSlas() {
        return this.slas;
    }

    public void setSlas(Set<TicketSLA> ticketSLAS) {
        if (this.slas != null) {
            this.slas.forEach(i -> i.setTicket(null));
        }
        if (ticketSLAS != null) {
            ticketSLAS.forEach(i -> i.setTicket(this));
        }
        this.slas = ticketSLAS;
    }

    public Ticket slas(Set<TicketSLA> ticketSLAS) {
        this.setSlas(ticketSLAS);
        return this;
    }

    public Ticket addSlas(TicketSLA ticketSLA) {
        this.slas.add(ticketSLA);
        ticketSLA.setTicket(this);
        return this;
    }

    public Ticket removeSlas(TicketSLA ticketSLA) {
        this.slas.remove(ticketSLA);
        ticketSLA.setTicket(null);
        return this;
    }

    public Set<TicketComment> getComments() {
        return this.comments;
    }

    public void setComments(Set<TicketComment> ticketComments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setTicket(null));
        }
        if (ticketComments != null) {
            ticketComments.forEach(i -> i.setTicket(this));
        }
        this.comments = ticketComments;
    }

    public Ticket comments(Set<TicketComment> ticketComments) {
        this.setComments(ticketComments);
        return this;
    }

    public Ticket addComments(TicketComment ticketComment) {
        this.comments.add(ticketComment);
        ticketComment.setTicket(this);
        return this;
    }

    public Ticket removeComments(TicketComment ticketComment) {
        this.comments.remove(ticketComment);
        ticketComment.setTicket(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ticket)) {
            return false;
        }
        return getId() != null && getId().equals(((Ticket) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ticket{" +
            "id=" + getId() +
            ", flowId=" + getFlowId() +
            ", ticketName='" + getTicketName() + "'" +
            ", creatorEmail='" + getCreatorEmail() + "'" +
            ", currentStepId=" + getCurrentStepId() +
            ", status=" + getStatus() +
            ", priority=" + getPriority() +
            ", version=" + getVersion() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", completedAt='" + getCompletedAt() + "'" +
            "}";
    }
}
